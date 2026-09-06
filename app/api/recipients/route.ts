import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { isProfileComplete } from '@/lib/auth/types';
import { checkBic, checkIban, normaliseIban } from '@/lib/config/iban';
import { CURRENCIES, type Currency, type RecipientConfig } from '@/lib/config/types';
import { readConfig, updateConfig } from '@/lib/config/store';
import {
  hasVerificationEmail,
  RecipientVerificationDeliveryError,
  sendRecipientVerification,
} from '@/lib/recipients/verification-service';
import { foreignOrigin } from '@/lib/http/origin';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

const cleanText = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';


async function requireCompletedClient() {
  const auth = await requireUser('client');
  if (isDenied(auth)) return auth;
  const t = await getTranslator();
  if (!isProfileComplete(auth.user)) {
    return {
      response: NextResponse.json(
        { error: t('Complete your profile before adding a recipient.') },
        { status: 403 },
      ),
    };
  }
  return auth;
}

export async function GET() {
  const auth = await requireCompletedClient();
  if (isDenied(auth)) return auth.response;

  const config = await readConfig();
  const recipients = (config.recipients ?? [])
    .filter((recipient) => recipient.ownerUserId === auth.user.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(recipients);
}

export async function POST(request: Request) {
  // Answers go back in the caller's language: the browser shows them as-is.
  const t = await getTranslator();
  const auth = await requireCompletedClient();
  if (isDenied(auth)) return auth.response;
  if (foreignOrigin(request)) {
    return NextResponse.json({ error: t('Invalid request origin.') }, { status: 403 });
  }
  if (!hasVerificationEmail(auth.user.username)) {
    return NextResponse.json(
      { error: t('Add an email address to this client account before verifying a beneficiary RIB.') },
      { status: 422 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  const name = cleanText(body.name, 120);
  const iban = normaliseIban(cleanText(body.iban, 42));
  const bic = normaliseIban(cleanText(body.bic, 11));
  const bankName = cleanText(body.bankName, 120);
  const currency = cleanText(body.currency, 3) as Currency;
  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = t('Enter the beneficiary account holder.');

  const ibanCheck = checkIban(iban);
  if (!ibanCheck.valid) {
    errors.iban = t(ibanCheck.reason ?? 'Enter a valid IBAN.', ibanCheck.reasonValues);
  }

  const bicCheck = checkBic(bic);
  if (!bic) errors.bic = t('Enter the BIC / SWIFT code.');
  else if (!bicCheck.valid) errors.bic = t(bicCheck.reason ?? 'Enter a valid BIC / SWIFT code.');

  if (!CURRENCIES.some((item) => item.code === currency)) {
    errors.currency = 'Select a supported currency.';
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: t('Check the bank details.'), errors }, { status: 400 });
  }

  const now = new Date().toISOString();
  const recipient: RecipientConfig = {
    id: `rec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    ownerUserId: auth.user.id,
    name,
    iban,
    bic,
    bankName,
    currency,
    verificationStatus: 'pending',
    verifiedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  let duplicate = false;
  await updateConfig((config) => {
    config.recipients ??= [];
    duplicate = config.recipients.some(
      (item) => item.ownerUserId === auth.user.id && item.iban === iban,
    );
    if (!duplicate) config.recipients.push(recipient);
    return config;
  });

  if (duplicate) {
    return NextResponse.json(
      { error: t('This IBAN is already saved for this client.') },
      { status: 409 },
    );
  }

  try {
    const verification = await sendRecipientVerification(auth.user, recipient);
    if (verification.status === 'cooldown') {
      return NextResponse.json(
        { error: t('Wait before requesting another verification code.'), ...verification },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        recipient,
        verification: {
          expiresAt: verification.expiresAt,
          destination: verification.destination,
        },
      },
      { status: 202 },
    );
  } catch (error) {
    // A RIB that never received a code must not remain in the registry.
    await updateConfig((config) => {
      config.recipients = (config.recipients ?? []).filter(
        (item) => item.id !== recipient.id || item.ownerUserId !== auth.user.id,
      );
      return config;
    });

    if (error instanceof RecipientVerificationDeliveryError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.kind === 'configuration' ? 503 : 502 },
      );
    }
    throw error;
  }
}
