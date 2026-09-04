import 'server-only';

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cookies } from 'next/headers';
import type { Role, SessionPayload } from './types';
import { SESSION_COOKIE } from './portal';

export { SESSION_COOKIE } from './portal';
const MAX_AGE_SECONDS = 60 * 60 * 8; // eight hours
const SECRET_FILE = path.join(process.cwd(), 'data', '.session-secret');

/**
 * The signing key lives in a file rather than the source, and is generated on
 * first run. Set SESSION_SECRET to override it in a real deployment.
 */
let cached: string | null = null;

async function getSecret(): Promise<string> {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (cached) return cached;
  try {
    cached = (await fs.readFile(SECRET_FILE, 'utf8')).trim();
    if (cached) return cached;
  } catch {
    /* falls through to generation */
  }
  cached = randomBytes(32).toString('hex');
  await fs.mkdir(path.dirname(SECRET_FILE), { recursive: true });
  await fs.writeFile(SECRET_FILE, cached, 'utf8');
  return cached;
}

const b64u = (buf: Buffer | string) =>
  Buffer.from(buf).toString('base64url');

async function sign(data: string) {
  return createHmac('sha256', await getSecret()).update(data).digest('base64url');
}

export async function createSessionToken(userId: string, role: Role, profileComplete: boolean) {
  const payload: SessionPayload = {
    userId,
    role,
    profileComplete,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const body = b64u(JSON.stringify(payload));
  return `${body}.${await sign(body)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;

  const expected = await sign(body);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

/** The session for the current request, or null. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
