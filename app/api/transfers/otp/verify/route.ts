import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { isProfileComplete } from '@/lib/auth/types';
import { foreignOrigin } from '@/lib/http/origin';
import { getTranslator } from '@/lib/i18n/server';
import { clearOtp, TRANSFER_SUBJECT, verifyOtp } from '@/lib/recipients/otp';

export const dynamic = 'force-dynamic';

/** Checks the code that authorises a transfer, and spends it. */
export async function POST(request: Request) {
  const t = await getTranslator();
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;
  if (!isProfileComplete(auth.user)) {
    return NextResponse.json({ error: t('Complete your profile first.') }, { status: 403 });
  }
  if (foreignOrigin(request)) {
    return NextResponse.json({ error: t('Invalid request origin.') }, { status: 403 });
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

  const result = await verifyOtp(auth.user.id, TRANSFER_SUBJECT, code);
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

  // Single use: the code is spent whether or not the caller asks again.
  await clearOtp(auth.user.id, TRANSFER_SUBJECT);
  return NextResponse.json({ status: 'authorised' });
}
