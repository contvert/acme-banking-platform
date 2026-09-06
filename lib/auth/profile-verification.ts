import 'server-only';

import { EmailDeliveryError, maskEmail, sendProfileOtpEmail } from '@/lib/email/resend';
import { clearOtp, issueOtp, PROFILE_EMAIL_SUBJECT } from '@/lib/recipients/otp';
import type { User } from './types';

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export class ProfileVerificationDeliveryError extends Error {
  constructor(message: string, readonly kind: 'email' | 'configuration') {
    super(message);
  }
}

export const isEmailAddress = (value: string) => EMAIL_PATTERN.test(value.trim());

export type SendProfileVerificationResult =
  | { status: 'sent'; expiresAt: string; destination: string }
  | { status: 'cooldown'; retryAfterSeconds: number };

/**
 * Sends the code that confirms a client owns the address they sign in with.
 * Same contract as the beneficiary flow: a delivery failure clears the code, so
 * a client is never asked for something that never arrived.
 */
export async function sendProfileVerification(
  user: Pick<User, 'id' | 'username'>,
  preferredName: string,
): Promise<SendProfileVerificationResult> {
  const destination = user.username.trim().toLowerCase();
  if (!isEmailAddress(destination)) {
    throw new ProfileVerificationDeliveryError(
      "Cet accès n'a pas d'adresse e-mail valide. Demandez à votre administrateur de la corriger.",
      'configuration',
    );
  }

  const issued = await issueOtp(user.id, PROFILE_EMAIL_SUBJECT);
  if (issued.status === 'cooldown') return issued;

  try {
    await sendProfileOtpEmail({
      to: destination,
      code: issued.code,
      preferredName: preferredName.trim() || 'you',
      expiresAt: issued.expiresAt,
    });
  } catch (error) {
    await clearOtp(user.id, PROFILE_EMAIL_SUBJECT);
    if (error instanceof EmailDeliveryError) {
      throw new ProfileVerificationDeliveryError(
        error.kind === 'configuration'
          ? "L'envoi d'e-mails n'est pas encore configuré."
          : "L'e-mail de confirmation n'a pas pu être envoyé. Réessayez.",
        error.kind === 'configuration' ? 'configuration' : 'email',
      );
    }
    throw error;
  }

  return { status: 'sent', expiresAt: issued.expiresAt, destination: maskEmail(destination) };
}
