import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { findById } from '@/lib/auth/store';
import { toPublicUser } from '@/lib/auth/types';
import { readConfig } from '@/lib/config/store';
import { scopeConfig } from '@/lib/config/scope';

export const dynamic = 'force-dynamic';

/** The config as the signed-in user is allowed to see it. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const user = await findById(session.userId);
  if (!user || user.disabled) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const config = await readConfig();
  return NextResponse.json({
    config: scopeConfig(config, toPublicUser(user)),
    user: toPublicUser(user),
  });
}
