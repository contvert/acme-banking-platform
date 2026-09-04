import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { readConfig, updateConfig, resetConfig } from '@/lib/config/store';
import type { AppConfig } from '@/lib/config/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  return NextResponse.json(await readConfig());
}

/** Patch the top-level blocks: company, currency, sections. */
export async function PATCH(request: Request) {
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  let body: Partial<AppConfig>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  const next = await updateConfig((config) => ({
    ...config,
    defaultCurrency: body.defaultCurrency ?? config.defaultCurrency,
    company: { ...config.company, ...(body.company ?? {}) },
    sections: { ...config.sections, ...(body.sections ?? {}) },
  }));

  return NextResponse.json(next);
}

/** Wipe back to a single account and no history. */
export async function DELETE() {
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  return NextResponse.json(await resetConfig());
}
