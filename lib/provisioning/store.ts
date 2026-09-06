import 'server-only';

import { promises as fs } from 'node:fs';
import { randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import path from 'node:path';

/**
 * The delayed-credential queue.
 *
 * When an external funnel (the LT winner flow) reports a finished dossier, an
 * access is created here straight away, but the client is not told their
 * password on the spot: a job is parked in this queue and the credentials
 * email leaves a few hours later, once a person has had time to review the new
 * access in the administration.
 *
 * The generated password is held here in the clear until the mail is sent,
 * then scrubbed — the account itself only ever stores the scrypt hash. The
 * queue lives under `data/`, which is git-ignored, exactly like the other
 * server-only state files.
 */

const FILE = path.join(process.cwd(), 'data', 'client-provisioning-queue.json');

export type ProvisioningStatus = 'pending' | 'sent' | 'failed';

export interface ProvisioningJob {
  id: string;
  /** The access this job delivers credentials for. */
  userId: string;
  /** Sign-in address, also the recipient of the credentials email. */
  email: string;
  displayName: string;
  /**
   * The generated password, in the clear. Present only while the job is
   * pending; cleared the moment the email is handed to the provider.
   */
  password: string | null;
  /** ISO instant before which the credentials must not be sent. */
  sendAfter: string;
  status: ProvisioningStatus;
  createdAt: string;
  sentAt: string | null;
  attempts: number;
  lastError: string | null;
  /** Where the job came from, for the admin audit trail. */
  source: string;
}

/**
 * How long after creation the credentials email leaves, in milliseconds.
 *
 * `PROVISIONING_DELAY_MINUTES` wins when set — handy for shortening the wait to
 * a minute or two while testing — otherwise `PROVISIONING_DELAY_HOURS` applies,
 * defaulting to three hours.
 */
export function delayMs(): number {
  const minutes = Number(process.env.PROVISIONING_DELAY_MINUTES);
  if (Number.isFinite(minutes) && minutes >= 0) return minutes * 60_000;
  const hours = Number(process.env.PROVISIONING_DELAY_HOURS);
  return (Number.isFinite(hours) && hours >= 0 ? hours : 3) * 3_600_000;
}

/**
 * The bearer secret both provisioning endpoints require. Returns null when
 * unset so callers can refuse rather than run open.
 */
export function provisioningSecret(): string | null {
  const secret = process.env.PROVISIONING_SHARED_SECRET?.trim();
  return secret && secret.length >= 16 ? secret : null;
}

/** Constant-time bearer check against {@link provisioningSecret}. */
export function checkBearer(header: string | null): boolean {
  const expected = provisioningSecret();
  if (!expected) return false;
  const presented = header?.replace(/^Bearer\s+/i, '').trim() ?? '';
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  // timingSafeEqual needs equal lengths; a length mismatch is already a miss.
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * A password a person can actually be handed: readable groups, no ambiguous
 * characters, comfortably past the eight-character minimum the store enforces.
 */
export function generatePassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz';
  const group = () =>
    Array.from({ length: 4 }, () => alphabet[randomInt(alphabet.length)]).join('');
  return `${group()}-${group()}-${group()}`;
}

async function readQueue(): Promise<ProvisioningJob[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw) as ProvisioningJob[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

async function writeQueue(jobs: ProvisioningJob[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(jobs, null, 2), 'utf8');
  await fs.rename(tmp, FILE);
}

export async function listJobs(): Promise<ProvisioningJob[]> {
  return readQueue();
}

export async function findJobByUserId(userId: string): Promise<ProvisioningJob | null> {
  return (await readQueue()).find((j) => j.userId === userId) ?? null;
}

export async function enqueueCredentials(input: {
  userId: string;
  email: string;
  displayName: string;
  password: string;
  source: string;
}): Promise<ProvisioningJob> {
  const now = Date.now();
  const job: ProvisioningJob = {
    id: `prov-${now.toString(36)}-${randomBytes(3).toString('hex')}`,
    userId: input.userId,
    email: input.email,
    displayName: input.displayName,
    password: input.password,
    sendAfter: new Date(now + delayMs()).toISOString(),
    status: 'pending',
    createdAt: new Date(now).toISOString(),
    sentAt: null,
    attempts: 0,
    lastError: null,
    source: input.source,
  };
  const jobs = await readQueue();
  await writeQueue([...jobs, job].slice(-500));
  return job;
}

/** Jobs whose delay has elapsed and that still need sending. */
export async function dueJobs(now = Date.now()): Promise<ProvisioningJob[]> {
  return (await readQueue()).filter(
    (j) => j.status === 'pending' && Date.parse(j.sendAfter) <= now,
  );
}

async function mutateJob(id: string, mutate: (job: ProvisioningJob) => void): Promise<void> {
  const jobs = await readQueue();
  const target = jobs.find((j) => j.id === id);
  if (!target) return;
  mutate(target);
  await writeQueue(jobs);
}

/** Records a successful send and scrubs the escrowed password. */
export async function markSent(id: string): Promise<void> {
  await mutateJob(id, (job) => {
    job.status = 'sent';
    job.sentAt = new Date().toISOString();
    job.attempts += 1;
    job.lastError = null;
    job.password = null;
  });
}

export async function markFailed(id: string, error: string): Promise<void> {
  await mutateJob(id, (job) => {
    job.attempts += 1;
    job.lastError = error;
    // Left pending so the next dispatch retries it.
  });
}
