import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { readUsers, createUser } from '@/lib/auth/store';
import { toPublicUser } from '@/lib/auth/types';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const users = await readUsers();
  // Hashes and salts never leave the server.
  return NextResponse.json(users.map((u) => ({
    ...toPublicUser(u),
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    disabled: u.disabled,
  })));
}

export async function POST(request: Request) {
  const t = await getTranslator();
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  let body: { username?: string; password?: string; displayName?: string; role?: string; accountIds?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  const role = body.role === 'admin' ? 'admin' : 'client';
  const result = await createUser({
    username: body.username ?? '',
    password: body.password ?? '',
    displayName: body.displayName ?? '',
    role,
    accountIds: Array.isArray(body.accountIds) ? body.accountIds : [],
  });

  if ('error' in result) {
    return NextResponse.json({ error: t(result.error) }, { status: 400 });
  }
  return NextResponse.json({ user: toPublicUser(result.user) }, { status: 201 });
}
