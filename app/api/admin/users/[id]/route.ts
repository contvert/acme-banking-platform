import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import {
  updateUsers,
  readUsers,
  hashPassword,
  adminCount,
  checkUsername,
  normaliseUsername,
} from '@/lib/auth/store';
import { toPublicUser } from '@/lib/auth/types';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const t = await getTranslator();
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const { id } = await ctx.params;
  let body: {
    username?: string;
    displayName?: string;
    password?: string;
    accountIds?: string[];
    disabled?: boolean;
    role?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  if (body.password !== undefined && body.password.length < 8) {
    return NextResponse.json({ error: t('The password must be at least 8 characters.') }, { status: 400 });
  }

  const users = await readUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return NextResponse.json({ error: t('Access not found.') }, { status: 404 });

  // Renaming the sign-in identity: same rule as creating one, and it may not
  // collide with somebody else's.
  const username = body.username === undefined ? null : normaliseUsername(body.username);
  if (username !== null) {
    const bad = checkUsername(username);
    if (bad) return NextResponse.json({ error: t(bad) }, { status: 400 });
    if (users.some((u) => u.id !== id && u.username === username)) {
      return NextResponse.json({ error: t('That username already exists.') }, { status: 400 });
    }
  }

  // Never let the last working admin be disabled or assigned the client role.
  const losingAdmin =
    target.role === 'admin' && (body.disabled === true || (body.role && body.role !== 'admin'));
  if (losingAdmin && (await adminCount(users)) <= 1) {
    return NextResponse.json({ error: t('At least one active administrator must remain.') }, { status: 400 });
  }

  const creds = body.password ? await hashPassword(body.password) : null;

  const next = await updateUsers((list) =>
    list.map((u) =>
      u.id === id
        ? {
            ...u,
            username: username ?? u.username,
            displayName: body.displayName ?? u.displayName,
            // A confirmed address is confirmed for the address that was
            // checked. Move the client to a new one and that confirmation no
            // longer says anything, so the codes have to be earned again.
            profile:
              u.profile && username !== null && username !== u.username
                ? { ...u.profile, emailVerifiedAt: null }
                : u.profile,
            accountIds: body.accountIds ?? u.accountIds,
            disabled: body.disabled ?? u.disabled,
            role: body.role === 'admin' || body.role === 'client' ? body.role : u.role,
            ...(creds ?? {}),
          }
        : u,
    ),
  );

  const updated = next.find((u) => u.id === id)!;
  return NextResponse.json({ user: toPublicUser(updated) });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const t = await getTranslator();
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const { id } = await ctx.params;
  const users = await readUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return NextResponse.json({ error: t('Access not found.') }, { status: 404 });

  if (target.id === auth.user.id) {
    return NextResponse.json({ error: t('You cannot delete your own access.') }, { status: 400 });
  }
  if (target.role === 'admin' && (await adminCount(users)) <= 1) {
    return NextResponse.json({ error: t('At least one active administrator must remain.') }, { status: 400 });
  }

  await updateUsers((list) => list.filter((u) => u.id !== id));
  return NextResponse.json({ ok: true });
}
