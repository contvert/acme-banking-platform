import 'server-only';

import { NextResponse } from 'next/server';
import { getSession } from './session';
import { findById } from './store';
import type { Role, User } from './types';

/**
 * Verifies the signed session for real. The middleware only decodes the cookie
 * to route the request; this is what actually authorises it, so a forged
 * cookie gets a redirect and nothing more.
 */
export async function requireUser(role?: Role): Promise<{ user: User } | { response: NextResponse }> {
  const session = await getSession();
  if (!session) {
    return { response: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) };
  }

  const user = await findById(session.userId);
  if (!user || user.disabled) {
    return { response: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) };
  }

  if (role && user.role !== role) {
    return { response: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }) };
  }

  return { user };
}

export const isDenied = (r: Awaited<ReturnType<typeof requireUser>>): r is { response: NextResponse } =>
  'response' in r;
