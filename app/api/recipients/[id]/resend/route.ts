import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { isProfileComplete } from '@/lib/auth/types';
import { readConfig } from '@/lib/config/store';
import {
  RecipientVerificationDeliveryError,
  sendRecipientVerification,
} from '@/lib/recipients/verification-service';
import { foreignOrigin } from '@/lib/http/origin';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };


export async function POST(request: Request, context: Ctx) {
  const t = await getTranslator();
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;
  if (!isProfileComplete(auth.user)) {
    return NextResponse.json({ error: t('Complete your profile first.') }, { status: 403 });
  }
  if (foreignOrigin(request)) {
    return NextResponse.json({ error: t('Invalid request origin.') }, { status: 403 });
  }

  const { id } = await context.params;
  const config = await readConfig();
  const recipient = (config.recipients ?? []).find(
    (item) => item.id === id && item.ownerUserId === auth.user.id,
  );
  if (!recipient) {
    return NextResponse.json({ error: t('Recipient not found.') }, { status: 404 });
  }
  if (recipient.verificationStatus === 'verified' && recipient.verifiedAt) {
    return NextResponse.json({ error: t('This RIB is already verified.') }, { status: 409 });
  }

  try {
    const verification = await sendRecipientVerification(auth.user, recipient);
    if (verification.status === 'cooldown') {
      return NextResponse.json(
        { error: t('Wait before requesting another code.'), retryAfterSeconds: verification.retryAfterSeconds },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { expiresAt: verification.expiresAt, destination: verification.destination },
      { status: 202 },
    );
  } catch (error) {
    if (error instanceof RecipientVerificationDeliveryError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.kind === 'configuration' ? 503 : 502 },
      );
    }
    throw error;
  }
}
