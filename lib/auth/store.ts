import 'server-only';

import { promises as fs } from 'node:fs';
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import path from 'node:path';
import type { Role, User } from './types';
import type { Message } from '@/lib/i18n/messages/catalog';

const scrypt = promisify(scryptCb);
const FILE = path.join(process.cwd(), 'data', 'users.json');

/** Kept out of app-config.json so password hashes can never leak through
 *  the config endpoint the browser reads. */
const KEYLEN = 64;

export async function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const derived = (await scrypt(password, salt, KEYLEN)) as Buffer;
  return { passwordHash: derived.toString('hex'), salt };
}

export async function verifyPassword(password: string, user: Pick<User, 'passwordHash' | 'salt'>) {
  const derived = (await scrypt(password, user.salt, KEYLEN)) as Buffer;
  const stored = Buffer.from(user.passwordHash, 'hex');
  // Lengths must match before timingSafeEqual, and the comparison itself is
  // constant-time so a wrong password cannot be found by timing.
  if (stored.length !== derived.length) return false;
  return timingSafeEqual(stored, derived);
}

/** The first admin, created on first run so the app is never locked out. */
export const DEFAULT_ADMIN = { username: 'admin', password: 'admin' };

async function seed(): Promise<User[]> {
  const { passwordHash, salt } = await hashPassword(DEFAULT_ADMIN.password);
  const admin: User = {
    id: 'usr-admin',
    username: DEFAULT_ADMIN.username,
    displayName: 'Administrateur',
    role: 'admin',
    passwordHash,
    salt,
    accountIds: [],
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    disabled: false,
  };
  await writeUsers([admin]);
  return [admin];
}

export async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw) as User[];
    return Array.isArray(parsed) && parsed.length ? parsed : seed();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return seed();
    throw err;
  }
}

export async function writeUsers(users: User[]): Promise<User[]> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(users, null, 2), 'utf8');
  await fs.rename(tmp, FILE);
  return users;
}

export async function updateUsers(mutate: (users: User[]) => User[] | Promise<User[]>) {
  const current = await readUsers();
  return writeUsers(await mutate(structuredClone(current)));
}

export async function findByUsername(username: string) {
  const users = await readUsers();
  return users.find((u) => u.username === username.trim().toLowerCase()) ?? null;
}

export async function findById(id: string) {
  const users = await readUsers();
  return users.find((u) => u.id === id) ?? null;
}

/**
 * A sign-in identity: an email address, or one of the short usernames the
 * seeded accounts still use. Shared so creating and renaming an access apply
 * exactly the same rule.
 */
export function normaliseUsername(value: string) {
  return value.trim().toLowerCase();
}

export function checkUsername(username: string): Message | null {
  const isLegacyUsername = /^[a-z0-9._-]{3,32}$/.test(username);
  const isEmail =
    username.length <= 254 &&
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(username);
  return isLegacyUsername || isEmail
    ? null
    : 'Enter a valid email address, or a username of 3 to 32 characters.';
}

/**
 * Refusals come back as catalogue keys rather than sentences: the store has
 * no idea which language the caller is answering in.
 */
export async function createUser(input: {
  username: string;
  password: string;
  displayName: string;
  role: Role;
  accountIds: string[];
}): Promise<{ user: User } | { error: Message }> {
  const username = normaliseUsername(input.username);
  const badUsername = checkUsername(username);
  if (badUsername) return { error: badUsername };
  if (input.password.length < 8) {
    return { error: 'The password must be at least 8 characters.' };
  }
  if (await findByUsername(username)) {
    return { error: 'That username already exists.' };
  }

  const { passwordHash, salt } = await hashPassword(input.password);
  const user: User = {
    id: `usr-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`,
    username,
    displayName: input.displayName.trim() || username,
    role: input.role,
    passwordHash,
    salt,
    accountIds: input.accountIds,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    disabled: false,
  };

  await updateUsers((users) => [...users, user]);
  return { user };
}

/** Never let the last enabled admin be removed or locked out. */
export async function adminCount(users: User[]) {
  return users.filter((u) => u.role === 'admin' && !u.disabled).length;
}
