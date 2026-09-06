import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { profileDraftForUser } from '@/lib/auth/profile';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { updateUsers } from '@/lib/auth/store';
import { toPublicUser } from '@/lib/auth/types';
import { PROFILE_EMAIL_SUBJECT, verifyOtp } from '@/lib/recipients/otp';
import { foreignOrigin } from '@/lib/http/origin';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
  const t = await getTranslator();
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;
  if (foreignOrigin(request)) {
    return NextResponse.json({ error: t('Invalid request origin.') }, { status: 403 });
  }

  if (!auth.user.profile) {
    return NextResponse.json(
      { error: t('Complete your profile first.') },
      { status: 409 },
    );
  }
  if (auth.user.profile.emailVerifiedAt) {
    return NextResponse.json({
      status: 'complete',
      profile: profileDraftForUser(auth.user),
      user: toPublicUser(auth.user),
    });
  }

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  const code = typeof body.code === 'string' ? body.code.replace(/\s/g, '') : '';
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: t('Enter the six-digit code.') }, { status: 400 });
  }

  const result = await verifyOtp(auth.user.id, PROFILE_EMAIL_SUBJECT, code);
  if (result.status === 'missing' || result.status === 'expired') {
    return NextResponse.json(
      { error: t('This code has expired. Request a new one.') },
      { status: 410 },
    );
  }
  if (result.status === 'locked') {
    return NextResponse.json(
      { error: t('Too many attempts. Request a new code.') },
      { status: 429 },
    );
  }
  if (result.status === 'invalid') {
    const left = result.attemptsRemaining;
    return NextResponse.json(
      {
        error:
          left === 1
            ? t('Incorrect code. 1 attempt remaining.')
            : t('Incorrect code. {remaining} attempts remaining.', { remaining: left }),
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const users = await updateUsers((current) =>
    current.map((user) =>
      user.id === auth.user.id && user.profile
        ? { ...user, profile: { ...user.profile, emailVerifiedAt: now, updatedAt: now } }
        : user,
    ),
  );
  const updated = users.find((user) => user.id === auth.user.id)!;

  await setSessionCookie(await createSessionToken(updated.id, updated.role, true));

  return NextResponse.json({
    status: 'complete',
    profile: profileDraftForUser(updated),
    user: toPublicUser(updated),
  });
}
