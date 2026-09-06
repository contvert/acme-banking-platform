import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import {
  normalizeClientProfile,
  profileDraftForUser,
  validateClientProfile,
  type ClientProfileDraft,
} from '@/lib/auth/profile';
import {
  ProfileVerificationDeliveryError,
  sendProfileVerification,
} from '@/lib/auth/profile-verification';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { updateUsers } from '@/lib/auth/store';
import { isProfileComplete, toPublicUser, type ClientProfile } from '@/lib/auth/types';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;

  return NextResponse.json({
    email: auth.user.username,
    profile: profileDraftForUser(auth.user),
    complete: isProfileComplete(auth.user),
    emailVerified: Boolean(auth.user.profile?.emailVerifiedAt),
  });
}

export async function POST(request: Request) {
  const t = await getTranslator();
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;

  let body: Partial<ClientProfileDraft>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  const draft = normalizeClientProfile(body);
  const errors = validateClientProfile(draft);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { error: t('Please review the highlighted fields.'), errors },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  // Editing the details does not re-open a confirmation that already happened:
  // the address is what was verified, and the address has not changed here.
  const alreadyVerified = auth.user.profile?.emailVerifiedAt ?? null;

  const profile: ClientProfile = {
    ...draft,
    completedAt: auth.user.profile?.completedAt ?? now,
    updatedAt: now,
    emailVerifiedAt: alreadyVerified,
  };

  const users = await updateUsers((current) =>
    current.map((user) =>
      user.id === auth.user.id
        ? { ...user, displayName: draft.preferredName, profile }
        : user,
    ),
  );
  const updated = users.find((user) => user.id === auth.user.id)!;

  // A confirmed address means the profile is done; refresh the signed state.
  if (alreadyVerified) {
    await setSessionCookie(await createSessionToken(updated.id, updated.role, true));
    return NextResponse.json({
      status: 'complete',
      profile: profileDraftForUser(updated),
      user: toPublicUser(updated),
    });
  }

  try {
    const verification = await sendProfileVerification(updated, draft.preferredName);
    if (verification.status === 'cooldown') {
      return NextResponse.json(
        {
          status: 'verification-pending',
          error: t('A code was just sent. Wait before requesting another.'),
          retryAfterSeconds: verification.retryAfterSeconds,
          profile: profileDraftForUser(updated),
          user: toPublicUser(updated),
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        status: 'verification-sent',
        verification: {
          expiresAt: verification.expiresAt,
          destination: verification.destination,
        },
        profile: profileDraftForUser(updated),
        user: toPublicUser(updated),
      },
      { status: 202 },
    );
  } catch (error) {
    if (error instanceof ProfileVerificationDeliveryError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.kind === 'configuration' ? 503 : 502 },
      );
    }
    throw error;
  }
}
