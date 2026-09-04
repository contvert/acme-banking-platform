import { NextResponse, type NextRequest } from 'next/server';
import { findByUsername, verifyPassword, updateUsers } from '@/lib/auth/store';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { isProfileComplete, toPublicUser } from '@/lib/auth/types';
import { portalForHostname, roleMatchesPortal } from '@/lib/auth/portal';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  const username = (body.username ?? '').trim().toLowerCase();
  const password = body.password ?? '';
  const user = await findByUsername(username);

  // One message for every failure, so the response cannot be used to learn
  // which usernames exist.
  const refuse = () =>
    NextResponse.json({ error: 'Identifiant ou mot de passe incorrect' }, { status: 401 });

  if (!user || user.disabled) {
    // Still spend the hashing time, so a missing user is not faster to probe.
    await verifyPassword(password, { passwordHash: '00'.repeat(64), salt: 'x' });
    return refuse();
  }
  if (!(await verifyPassword(password, user))) return refuse();

  // Browser login requests carry their public origin even when a development
  // proxy rewrites the route handler's URL and Host header to localhost.
  let originPortal: ReturnType<typeof portalForHostname> = 'shared';
  try {
    const origin = request.headers.get('origin');
    if (origin) originPortal = portalForHostname(new URL(origin).hostname);
  } catch {
    // A malformed Origin is treated as shared and cannot select a role realm.
  }

  // The proxy overwrites this internal header from the public request host.
  // Keep direct-request fallbacks for environments where the proxy is absent.
  const annotatedPortal = request.headers.get('x-mercury-auth-portal');
  const portal = originPortal !== 'shared'
    ? originPortal
    : annotatedPortal === 'admin' || annotatedPortal === 'client'
      ? annotatedPortal
      : portalForHostname(request.headers.get('host') ?? request.nextUrl.hostname);
  if (!roleMatchesPortal(user.role, portal)) {
    return NextResponse.json(
      {
        error: portal === 'admin'
          ? 'Cet accès appartient au portail client.'
          : 'Cet accès appartient au portail administrateur.',
      },
      { status: 403 },
    );
  }

  await updateUsers((users) =>
    users.map((u) => (u.id === user.id ? { ...u, lastLoginAt: new Date().toISOString() } : u)),
  );

  await setSessionCookie(await createSessionToken(user.id, user.role, isProfileComplete(user)));
  return NextResponse.json({ user: toPublicUser(user) });
}
