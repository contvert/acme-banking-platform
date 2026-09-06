import 'server-only';

import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const OTP_FILE = path.join(process.cwd(), 'data', 'recipient-verifications.json');
const SECRET_FILE = path.join(process.cwd(), 'data', '.otp-secret');
const TTL_MS = 10 * 60 * 1000;
const COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

interface OtpRecord {
  /** What the code authorises: a recipient id, or a purpose such as 'profile-email'. */
  subjectId: string;
  ownerUserId: string;
  codeHash: string;
  expiresAt: string;
  sentAt: string;
  attempts: number;
}

let cachedSecret: string | null = null;

async function getSecret() {
  if (process.env.OTP_SECRET) return process.env.OTP_SECRET;
  if (cachedSecret) return cachedSecret;

  try {
    cachedSecret = (await fs.readFile(SECRET_FILE, 'utf8')).trim();
    if (cachedSecret) return cachedSecret;
  } catch {
    // A local secret is generated below for single-instance development.
  }

  cachedSecret = randomBytes(32).toString('hex');
  await fs.mkdir(path.dirname(SECRET_FILE), { recursive: true });
  await fs.writeFile(SECRET_FILE, cachedSecret, 'utf8');
  return cachedSecret;
}

async function hashCode(ownerUserId: string, subjectId: string, code: string) {
  return createHmac('sha256', await getSecret())
    .update(`${ownerUserId}:${subjectId}:${code}`)
    .digest('hex');
}

async function readRecords(): Promise<OtpRecord[]> {
  try {
    const raw = await fs.readFile(OTP_FILE, 'utf8');
    const parsed = JSON.parse(raw) as OtpRecord[];
    if (!Array.isArray(parsed)) return [];

    // Old expired records have no use and must not accumulate on disk.
    const retentionLimit = Date.now() - 24 * 60 * 60 * 1000;
    return parsed.filter((record) => Date.parse(record.expiresAt) >= retentionLimit);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeRecords(records: OtpRecord[]) {
  await fs.mkdir(path.dirname(OTP_FILE), { recursive: true });
  const temporary = `${OTP_FILE}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(records, null, 2), 'utf8');
  await fs.rename(temporary, OTP_FILE);
}

export type IssueOtpResult =
  | { status: 'issued'; code: string; expiresAt: string }
  | { status: 'cooldown'; retryAfterSeconds: number };

/** Create one single-use OTP. The caller is responsible for delivering it. */
export async function issueOtp(
  ownerUserId: string,
  subjectId: string,
): Promise<IssueOtpResult> {
  const now = Date.now();
  const records = await readRecords();
  const current = records.find(
    (record) => record.ownerUserId === ownerUserId && record.subjectId === subjectId,
  );
  const sentAt = current ? Date.parse(current.sentAt) : 0;

  if (current && Number.isFinite(sentAt) && now - sentAt < COOLDOWN_MS) {
    return {
      status: 'cooldown',
      retryAfterSeconds: Math.max(1, Math.ceil((COOLDOWN_MS - (now - sentAt)) / 1000)),
    };
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
  const expiresAt = new Date(now + TTL_MS).toISOString();
  const record: OtpRecord = {
    subjectId,
    ownerUserId,
    codeHash: await hashCode(ownerUserId, subjectId, code),
    expiresAt,
    sentAt: new Date(now).toISOString(),
    attempts: 0,
  };

  await writeRecords([
    ...records.filter(
      (item) => item.ownerUserId !== ownerUserId || item.subjectId !== subjectId,
    ),
    record,
  ]);

  return { status: 'issued', code, expiresAt };
}

export type VerifyOtpResult =
  | { status: 'verified' }
  | { status: 'missing' | 'expired' | 'locked' }
  | { status: 'invalid'; attemptsRemaining: number };

/** Verify the code in constant time and invalidate it immediately on success. */
export async function verifyOtp(
  ownerUserId: string,
  subjectId: string,
  code: string,
): Promise<VerifyOtpResult> {
  const records = await readRecords();
  const index = records.findIndex(
    (record) => record.ownerUserId === ownerUserId && record.subjectId === subjectId,
  );
  if (index < 0) return { status: 'missing' };

  const current = records[index];
  if (Date.parse(current.expiresAt) <= Date.now()) {
    records.splice(index, 1);
    await writeRecords(records);
    return { status: 'expired' };
  }

  if (current.attempts >= MAX_ATTEMPTS) return { status: 'locked' };

  const received = Buffer.from(await hashCode(ownerUserId, subjectId, code));
  const expected = Buffer.from(current.codeHash);
  const matches = received.length === expected.length && timingSafeEqual(received, expected);

  if (!matches) {
    current.attempts += 1;
    await writeRecords(records);
    if (current.attempts >= MAX_ATTEMPTS) return { status: 'locked' };
    return { status: 'invalid', attemptsRemaining: MAX_ATTEMPTS - current.attempts };
  }

  records.splice(index, 1);
  await writeRecords(records);
  return { status: 'verified' };
}

/** Remove the pending code when its RIB is removed or email delivery fails. */
export async function clearOtp(ownerUserId: string, subjectId: string) {
  const records = await readRecords();
  const remaining = records.filter(
    (record) => record.ownerUserId !== ownerUserId || record.subjectId !== subjectId,
  );
  if (remaining.length !== records.length) await writeRecords(remaining);
}

export const OTP_TTL_SECONDS = TTL_MS / 1000;

/* The recipient flow keeps its own names; both share one store and one secret. */
export const issueRecipientOtp = issueOtp;
export const verifyRecipientOtp = verifyOtp;
export const clearRecipientOtp = clearOtp;

/** Purpose key for confirming the address on a client profile. */
export const PROFILE_EMAIL_SUBJECT = 'profile-email';

/** Purpose key for authorising one transfer. */
export const TRANSFER_SUBJECT = 'transfer';
