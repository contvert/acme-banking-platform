import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import {
  ProfileVerificationDeliveryError,
  sendProfileVerification,
} from '@/lib/auth/profile-verification';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const t = await getTranslator();
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth.response;

  if (!auth.user.profile) {
    return NextResponse.json({ error: t('Complete your profile first.') }, { status: 409 });
  }
  if (auth.user.profile.emailVerifiedAt) {
    return NextResponse.json({ status: 'already-verified' });
  }

  try {
    const verification = await sendProfileVerification(
      auth.user,
      auth.user.profile.preferredName,
    );
    if (verification.status === 'cooldown') {
      return NextResponse.json(
        { error: t('Wait before requesting another code.'), retryAfterSeconds: verification.retryAfterSeconds },
        { status: 429 },
      );
    }
    return NextResponse.json({
      status: 'sent',
      expiresAt: verification.expiresAt,
      destination: verification.destination,
    });
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
