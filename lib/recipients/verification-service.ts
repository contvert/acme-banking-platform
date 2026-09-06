import 'server-only';

import type { User } from '@/lib/auth/types';
import type { RecipientConfig } from '@/lib/config/types';
import { EmailDeliveryError, maskEmail, sendRecipientOtpEmail } from '@/lib/email/resend';
import { clearRecipientOtp, issueRecipientOtp } from './otp';

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export class RecipientVerificationDeliveryError extends Error {
  constructor(message: string, readonly kind: 'email' | 'configuration') {
    super(message);
  }
}

export const hasVerificationEmail = (value: string) => EMAIL_PATTERN.test(value.trim());

export type SendVerificationResult =
  | { status: 'sent'; expiresAt: string; destination: string }
  | { status: 'cooldown'; retryAfterSeconds: number };

/** Generate and deliver a RIB OTP to the account email without exposing it to the client. */
export async function sendRecipientVerification(
  user: Pick<User, 'id' | 'username'>,
  recipient: Pick<RecipientConfig, 'id' | 'name' | 'iban'>,
): Promise<SendVerificationResult> {
  const destination = user.username.trim().toLowerCase();
  if (!hasVerificationEmail(destination)) {
    throw new RecipientVerificationDeliveryError(
      'An email address is required to verify a beneficiary RIB.',
      'configuration',
    );
  }

  const issued = await issueRecipientOtp(user.id, recipient.id);
  if (issued.status === 'cooldown') return issued;

  try {
    await sendRecipientOtpEmail({
      to: destination,
      code: issued.code,
      recipientId: recipient.id,
      recipientName: recipient.name,
      ibanLast4: recipient.iban.slice(-4),
      expiresAt: issued.expiresAt,
    });
  } catch (error) {
    // A failed delivery must never leave a code that the client did not receive.
    await clearRecipientOtp(user.id, recipient.id);
    if (error instanceof EmailDeliveryError) {
      throw new RecipientVerificationDeliveryError(
        error.kind === 'configuration'
          ? 'Email verification is not configured yet.'
          : 'The verification email could not be sent. Please try again.',
        error.kind === 'configuration' ? 'configuration' : 'email',
      );
    }
    throw error;
  }

  return { status: 'sent', expiresAt: issued.expiresAt, destination: maskEmail(destination) };
}
