import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { isProfileComplete } from '@/lib/auth/types';
import { foreignOrigin } from '@/lib/http/origin';
import { getTranslator } from '@/lib/i18n/server';
import { sendTransferVerification, TransferVerificationError } from '@/lib/transfers/verification';

export const dynamic = 'force-dynamic';

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

/** Sends the code that authorises the transfer described in the body. */
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

  let body: { amount?: unknown; beneficiary?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  // The email names what the code authorises, so both are required: a code
  // that cannot say what it is for teaches the reader to approve anything.
  const amount = clean(body.amount, 40);
  const beneficiary = clean(body.beneficiary, 120);
  if (!amount || !beneficiary) {
    return NextResponse.json(
      { error: t('Enter an amount and a destination first.') },
      { status: 400 },
    );
  }

  try {
    const sent = await sendTransferVerification(auth.user, { amount, beneficiary });
    if (sent.status === 'cooldown') {
      return NextResponse.json(
        {
          error: t('A code was just sent. Wait before requesting another.'),
          retryAfterSeconds: sent.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { status: 'sent', expiresAt: sent.expiresAt, destination: sent.destination },
      { status: 202 },
    );
  } catch (error) {
    if (error instanceof TransferVerificationError) {
      return NextResponse.json(
        { error: t('Could not send the code. Try again.') },
        { status: error.kind === 'configuration' ? 503 : 502 },
      );
    }
    throw error;
  }
}
