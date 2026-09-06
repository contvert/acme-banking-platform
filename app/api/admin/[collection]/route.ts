import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { readConfig, updateConfig } from '@/lib/config/store';
import { COLLECTIONS, type CollectionName } from '@/lib/config/types';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

function parse(name: string): CollectionName | null {
  return (COLLECTIONS as readonly string[]).includes(name) ? (name as CollectionName) : null;
}

/** The collections hold different item shapes; work with them structurally. */
type AnyItem = { id: string } & Record<string, unknown>;
const listOf = (config: import('@/lib/config/types').AppConfig, key: CollectionName) =>
  config[key] as unknown as AnyItem[];

const unknown = (name: string) =>
  NextResponse.json(
    { error: `Unknown collection '${name}'`, known: COLLECTIONS },
    { status: 404 },
  );

export async function GET(_: Request, ctx: { params: Promise<{ collection: string }> }) {
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const { collection } = await ctx.params;
  const key = parse(collection);
  if (!key) return unknown(collection);

  const config = await readConfig();
  return NextResponse.json(config[key]);
}

/** Append one item. The id is generated here so clients cannot collide. */
export async function POST(request: Request, ctx: { params: Promise<{ collection: string }> }) {
  const t = await getTranslator();
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const { collection } = await ctx.params;
  const key = parse(collection);
  if (!key) return unknown(collection);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  const id = `${key.slice(0, 3)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const item: AnyItem = { ...body, id };

  const next = await updateConfig((config) => {
    const list = listOf(config, key);
    if (key === 'bankDetails') {
      const wantsPrimary = item.primary === true || list.length === 0;
      if (wantsPrimary) list.forEach((x) => { x.primary = false; });
      item.primary = wantsPrimary;
    }
    list.push(item);
    return config;
  });

  return NextResponse.json({ item, collection: next[key] }, { status: 201 });
}
