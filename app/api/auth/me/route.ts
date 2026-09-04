import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { findById } from '@/lib/auth/store';
import { toPublicUser } from '@/lib/auth/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  const user = await findById(session.userId);
  if (!user || user.disabled) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({ user: toPublicUser(user) });
}
