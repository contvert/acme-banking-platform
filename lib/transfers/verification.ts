import 'server-only';

import { EmailDeliveryError, maskEmail, sendTransferOtpEmail } from '@/lib/email/resend';
import { clearOtp, issueOtp, TRANSFER_SUBJECT } from '@/lib/recipients/otp';
import { isEmailAddress } from '@/lib/auth/profile-verification';
import type { User } from '@/lib/auth/types';

export class TransferVerificationError extends Error {
  constructor(message: string, readonly kind: 'email' | 'configuration') {
    super(message);
  }
}

export type SendTransferVerificationResult =
  | { status: 'sent'; expiresAt: string; destination: string }
  | { status: 'cooldown'; retryAfterSeconds: number };

/**
 * Sends the code that authorises one transfer.
 *
 * Same contract as the other two flows, including the part that matters most:
 * a delivery failure clears the code, so a client is never asked to type
 * something that never arrived.
 */
export async function sendTransferVerification(
  user: Pick<User, 'id' | 'username'>,
  transfer: { amount: string; beneficiary: string },
): Promise<SendTransferVerificationResult> {
  const destination = user.username.trim().toLowerCase();
  if (!isEmailAddress(destination)) {
    throw new TransferVerificationError(
      "This access has no valid email address. Ask your administrator to correct it.",
      'configuration',
    );
  }

  const issued = await issueOtp(user.id, TRANSFER_SUBJECT);
  if (issued.status === 'cooldown') return issued;

  try {
    await sendTransferOtpEmail({
      to: destination,
      code: issued.code,
      amount: transfer.amount,
      beneficiary: transfer.beneficiary,
      expiresAt: issued.expiresAt,
    });
  } catch (error) {
    await clearOtp(user.id, TRANSFER_SUBJECT);
    if (error instanceof EmailDeliveryError) {
      throw new TransferVerificationError(
        error.kind === 'configuration'
          ? 'Email delivery is not configured yet.'
          : 'The authorisation email could not be sent. Try again.',
        error.kind === 'configuration' ? 'configuration' : 'email',
      );
    }
    throw error;
  }

  return { status: 'sent', expiresAt: issued.expiresAt, destination: maskEmail(destination) };
}
