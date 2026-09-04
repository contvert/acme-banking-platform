import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import {
  normalizeClientProfile,
  profileDraftForUser,
  validateClientProfile,
  type ClientProfileDraft,
} from '@/lib/auth/profile';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { updateUsers } from '@/lib/auth/store';
import { isProfileComplete, toPublicUser, type ClientProfile } from '@/lib/auth/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;

  return NextResponse.json({
    email: auth.user.username,
    profile: profileDraftForUser(auth.user),
    complete: isProfileComplete(auth.user),
  });
}

export async function POST(request: Request) {
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;

  let body: Partial<ClientProfileDraft>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  const draft = normalizeClientProfile(body);
  const errors = validateClientProfile(draft);
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { error: 'Please review the highlighted fields.', errors },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const profile: ClientProfile = {
    ...draft,
    completedAt: auth.user.profile?.completedAt ?? now,
    updatedAt: now,
  };

  const users = await updateUsers((current) =>
    current.map((user) =>
      user.id === auth.user.id
        ? { ...user, displayName: draft.preferredName, profile }
        : user,
    ),
  );
  const updated = users.find((user) => user.id === auth.user.id)!;

  // Refresh the signed onboarding state so the next navigation can proceed.
  await setSessionCookie(await createSessionToken(updated.id, updated.role, true));

  return NextResponse.json({
    profile: profileDraftForUser(updated),
    user: toPublicUser(updated),
  });
}
