import { NextResponse } from 'next/server';
import { readUsers, verifyPassword, DEFAULT_ADMIN } from '@/lib/auth/store';

export const dynamic = 'force-dynamic';

/**
 * Reports whether the untouched seed admin is still in place, so the login page
 * can tell a fresh install how to get in.
 *
 * This only ever confirms a credential pair that is already the documented
 * default — the moment the password is changed, or any other user exists, it
 * reports nothing.
 */
export async function GET() {
  const users = await readUsers();

  const soleAdmin =
    users.length === 1 &&
    users[0].role === 'admin' &&
    users[0].username === DEFAULT_ADMIN.username &&
    !users[0].disabled;

  if (!soleAdmin) return NextResponse.json({ firstRun: false });

  const untouched = await verifyPassword(DEFAULT_ADMIN.password, users[0]);
  return NextResponse.json(
    untouched
      ? { firstRun: true, username: DEFAULT_ADMIN.username, password: DEFAULT_ADMIN.password }
      : { firstRun: false },
  );
}
