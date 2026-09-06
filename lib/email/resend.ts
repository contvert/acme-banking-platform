import 'server-only';

import { promises as fs } from 'node:fs';
import { getLocale, getTranslator } from '@/lib/i18n/server';
import path from 'node:path';
import {
  recipientOtpHtml,
  recipientOtpSubject,
  recipientOtpText,
} from './templates/recipient-otp';
import {
  profileOtpHtml,
  profileOtpSubject,
  profileOtpText,
} from './templates/profile-email-otp';
import {
  transferOtpHtml,
  transferOtpSubject,
  transferOtpText,
} from './templates/transfer-otp';
import {
  credentialsHtml,
  credentialsSubject,
  credentialsText,
} from './templates/client-credentials';

const DEVELOPMENT_OUTBOX = path.join(process.cwd(), 'data', 'dev-email-outbox.json');
const DELIVERY_LOG = path.join(process.cwd(), 'data', 'email-delivery-log.json');

export class EmailDeliveryError extends Error {
  constructor(
    message: string,
    readonly kind: 'configuration' | 'provider',
  ) {
    super(message);
  }
}

interface DevelopmentEmail {
  id: string;
  to: string;
  subject: string;
  text: string;
  recipientId: string;
  code: string;
  createdAt: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character] ?? character));
}

async function saveDevelopmentEmail(email: DevelopmentEmail) {
  let outbox: DevelopmentEmail[] = [];
  try {
    const raw = await fs.readFile(DEVELOPMENT_OUTBOX, 'utf8');
    const parsed = JSON.parse(raw) as DevelopmentEmail[];
    outbox = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }

  // Keep enough local messages for test inspection without retaining them indefinitely.
  const next = [...outbox, email].slice(-100);
  await fs.mkdir(path.dirname(DEVELOPMENT_OUTBOX), { recursive: true });
  const temporary = `${DEVELOPMENT_OUTBOX}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(next, null, 2), 'utf8');
  await fs.rename(temporary, DEVELOPMENT_OUTBOX);
}

interface DeliveryEntry {
  at: string;
  provider: 'resend' | 'development';
  providerId: string | null;
  to: string;
  recipientId: string;
}

/**
 * A short audit trail of what was handed to the provider. It records the
 * message id but never the code, so "was it sent, and what did the provider
 * say" can be answered later without keeping a live OTP on disk.
 */
async function recordDelivery(entry: DeliveryEntry) {
  let log: DeliveryEntry[] = [];
  try {
    const raw = await fs.readFile(DELIVERY_LOG, 'utf8');
    const parsed = JSON.parse(raw) as DeliveryEntry[];
    log = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }

  const next = [...log, entry].slice(-200);
  await fs.mkdir(path.dirname(DELIVERY_LOG), { recursive: true });
  const temporary = `${DELIVERY_LOG}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(next, null, 2), 'utf8');
  await fs.rename(temporary, DELIVERY_LOG);
}

/**
 * Addresses RFC 2606 and RFC 6761 set aside so they can never be delivered:
 * the `.test`, `.example`, `.invalid` and `.localhost` TLDs, and the
 * example.com family. Nothing behind one of these can receive a code, so
 * handing them to a provider only burns a paid send on a guaranteed bounce.
 */
const RESERVED_DOMAIN =
  /(?:^|\.)(?:example\.(?:com|net|org)|test|example|invalid|localhost)$/i;

export function isReservedAddress(email: string) {
  const domain = email.trim().toLowerCase().split('@')[1];
  return Boolean(domain) && RESERVED_DOMAIN.test(domain);
}

export function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  if (!local || !domain) return 'your email address';
  const start = local.slice(0, 1);
  return `${start}${'•'.repeat(Math.max(2, Math.min(5, local.length - 1)))}@${domain}`;
}

/**
 * The one path a message takes: local file in development when no key is set,
 * refusal in production, otherwise Resend. Both senders go through here so the
 * audit trail and the failure modes stay identical.
 */
async function deliver({
  to,
  subject,
  text,
  html,
  code = '',
  subjectId,
  from: fromOverride,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** The OTP, kept in the dev outbox for inspection. Empty for non-OTP mail. */
  code?: string;
  /** What the message concerns, for the log and the idempotency key. */
  subjectId: string;
  /** Sender identity, when the message is sent on behalf of another brand. */
  from?: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = fromOverride?.trim() || process.env.RESEND_FROM;

  // A reserved address cannot receive anything. In production that is a broken
  // account rather than a delivery problem, and saying so is more useful than
  // reporting a provider failure the administrator cannot act on.
  const reserved = isReservedAddress(to);
  if (reserved && process.env.NODE_ENV === 'production') {
    throw new EmailDeliveryError(
      'That address belongs to a reserved domain and cannot receive mail.',
      'configuration',
    );
  }

  if (!apiKey || reserved) {
    if (!apiKey && process.env.NODE_ENV === 'production') {
      throw new EmailDeliveryError('Resend is not configured.', 'configuration');
    }

    const email: DevelopmentEmail = {
      id: `dev-mail-${Date.now().toString(36)}`,
      to,
      subject,
      text,
      recipientId: subjectId,
      code,
      createdAt: new Date().toISOString(),
    };
    await saveDevelopmentEmail(email);
    await recordDelivery({
      at: new Date().toISOString(),
      provider: 'development',
      providerId: email.id,
      to: maskEmail(to),
      recipientId: subjectId,
    });
    return { provider: 'development' as const, id: email.id };
  }

  if (!from) {
    throw new EmailDeliveryError('RESEND_FROM is not configured.', 'configuration');
  }

  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mercury-banking-otp/1.0',
        'Idempotency-Key': `otp-${subjectId}-${Date.now()}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      cache: 'no-store',
    });
  } catch {
    throw new EmailDeliveryError('Resend could not be reached.', 'provider');
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Resend OTP delivery failed', { status: response.status, body });
    throw new EmailDeliveryError('Resend could not deliver the message.', 'provider');
  }

  const providerId = typeof body.id === 'string' ? body.id : null;
  await recordDelivery({
    at: new Date().toISOString(),
    provider: 'resend',
    providerId,
    to: maskEmail(to),
    recipientId: subjectId,
  });

  // Outside production, keep a copy of what was sent. It makes a real send
  // inspectable locally — otherwise configuring a provider silently removes
  // the only way to see the message, including from the tests.
  if (process.env.NODE_ENV !== 'production') {
    await saveDevelopmentEmail({
      id: providerId ?? `sent-${Date.now().toString(36)}`,
      to,
      subject,
      text,
      recipientId: subjectId,
      code,
      createdAt: new Date().toISOString(),
    });
  }

  return { provider: 'resend' as const, id: providerId };
}

/** Verifies the bank details a client saved for a beneficiary. */
export async function sendRecipientOtpEmail({
  to,
  code,
  recipientId,
  recipientName,
  ibanLast4,
  expiresAt,
}: {
  to: string;
  code: string;
  recipientId: string;
  recipientName: string;
  ibanLast4: string;
  expiresAt: string;
}) {
  const validForMinutes = Math.max(1, Math.round((Date.parse(expiresAt) - Date.now()) / 60000));
  const content = { code, recipientName, ibanLast4, expiresAt, validForMinutes };
  // The client is the one asking for this code, so the request's language is
  // theirs — the message arrives in the language they are reading the app in.
  const t = await getTranslator();
  const locale = await getLocale();

  return deliver({
    to,
    subject: recipientOtpSubject(t, code),
    text: recipientOtpText(t, content),
    html: recipientOtpHtml(t, locale, content),
    code,
    subjectId: recipientId,
  });
}


/** Confirms the address on a client profile. Shares the provider path above. */
export async function sendProfileOtpEmail({
  to,
  code,
  preferredName,
  expiresAt,
}: {
  to: string;
  code: string;
  preferredName: string;
  expiresAt: string;
}) {
  const validForMinutes = Math.max(1, Math.round((Date.parse(expiresAt) - Date.now()) / 60000));
  const content = { code, preferredName, validForMinutes };
  const t = await getTranslator();
  const locale = await getLocale();

  return deliver({
    to,
    subject: profileOtpSubject(t, code),
    text: profileOtpText(t, content),
    html: profileOtpHtml(t, locale, content),
    code,
    subjectId: 'profile-email',
  });
}


/** Authorises one transfer. Shares the provider path above. */
export async function sendTransferOtpEmail({
  to,
  code,
  amount,
  beneficiary,
  expiresAt,
}: {
  to: string;
  code: string;
  /** Already formatted for the reader, currency included. */
  amount: string;
  beneficiary: string;
  expiresAt: string;
}) {
  const validForMinutes = Math.max(1, Math.round((Date.parse(expiresAt) - Date.now()) / 60000));
  const content = { code, amount, beneficiary, validForMinutes };
  const t = await getTranslator();
  const locale = await getLocale();

  return deliver({
    to,
    subject: transferOtpSubject(t, code),
    text: transferOtpText(t, content),
    html: transferOtpHtml(t, locale, content),
    code,
    subjectId: 'transfer',
  });
}


/**
 * Hands a lottery winner their first credentials for the payout space. Not an
 * OTP: it carries an identifier, a generated password and a sign-in link, and
 * is sent by the scheduler rather than from a signed-in session.
 *
 * The message is sent on behalf of the lottery, not the banking platform, so
 * its sender identity comes from PROVISIONING_EMAIL_FROM / _REPLY_TO when set
 * (falling back to the default RESEND_FROM otherwise). Shares the provider path
 * above so its audit trail and failure modes match everything else.
 */
export async function sendClientCredentialsEmail({
  to,
  displayName,
  username,
  password,
  loginUrl,
}: {
  to: string;
  displayName: string;
  username: string;
  password: string;
  loginUrl: string;
}) {
  const content = { displayName, username, password, loginUrl };
  return deliver({
    to,
    subject: credentialsSubject(),
    text: credentialsText(content),
    html: credentialsHtml(content),
    subjectId: 'client-credentials',
    from: process.env.PROVISIONING_EMAIL_FROM,
    replyTo: process.env.PROVISIONING_EMAIL_REPLY_TO,
  });
}
