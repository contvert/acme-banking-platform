import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { updateUsers, readUsers, hashPassword, adminCount } from '@/lib/auth/store';
import { toPublicUser } from '@/lib/auth/types';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const { id } = await ctx.params;
  let body: { displayName?: string; password?: string; accountIds?: string[]; disabled?: boolean; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  if (body.password !== undefined && body.password.length < 8) {
    return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères' }, { status: 400 });
  }

  const users = await readUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

  // Never let the last working admin be disabled or assigned the client role.
  const losingAdmin =
    target.role === 'admin' && (body.disabled === true || (body.role && body.role !== 'admin'));
  if (losingAdmin && (await adminCount(users)) <= 1) {
    return NextResponse.json({ error: 'Il doit rester au moins un administrateur actif' }, { status: 400 });
  }

  const creds = body.password ? await hashPassword(body.password) : null;

  const next = await updateUsers((list) =>
    list.map((u) =>
      u.id === id
        ? {
            ...u,
            displayName: body.displayName ?? u.displayName,
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
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const { id } = await ctx.params;
  const users = await readUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

  if (target.id === auth.user.id) {
    return NextResponse.json({ error: 'Vous ne pouvez pas supprimer votre propre accès' }, { status: 400 });
  }
  if (target.role === 'admin' && (await adminCount(users)) <= 1) {
    return NextResponse.json({ error: 'Il doit rester au moins un administrateur actif' }, { status: 400 });
  }

  await updateUsers((list) => list.filter((u) => u.id !== id));
  return NextResponse.json({ ok: true });
}
