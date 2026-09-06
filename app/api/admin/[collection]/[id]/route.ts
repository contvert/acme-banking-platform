import { NextResponse } from 'next/server';
import { requireUser, isDenied } from '@/lib/auth/guard';
import { updateConfig } from '@/lib/config/store';
import { COLLECTIONS, type CollectionName } from '@/lib/config/types';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

function parse(name: string): CollectionName | null {
  return (COLLECTIONS as readonly string[]).includes(name) ? (name as CollectionName) : null;
}

const unknown = (name: string) =>
  NextResponse.json({ error: `Unknown collection '${name}'`, known: COLLECTIONS }, { status: 404 });

/** The collections hold different item shapes; work with them structurally. */
type AnyItem = { id: string } & Record<string, unknown>;
const listOf = (config: import('@/lib/config/types').AppConfig, key: CollectionName) =>
  config[key] as unknown as AnyItem[];

type Ctx = { params: Promise<{ collection: string; id: string }> };

/** Merge fields into one item. */
export async function PATCH(request: Request, ctx: Ctx) {
  const t = await getTranslator();
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const { collection, id } = await ctx.params;
  const key = parse(collection);
  if (!key) return unknown(collection);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  let found = false;
  const next = await updateConfig((config) => {
    const list = listOf(config, key);
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) {
      found = true;
      // id stays authoritative — a client cannot rewrite it through the body
      list[i] = { ...list[i], ...body, id };

      // Exactly one bank account can be primary; enforce it here rather than
      // trusting a client to clear the others.
      if (key === 'bankDetails' && body.primary === true) {
        list.forEach((item, j) => {
          if (j !== i) item.primary = false;
        });
      }
    }
    return config;
  });

  if (!found) return NextResponse.json({ error: `No '${collection}' with id '${id}'` }, { status: 404 });
  return NextResponse.json({ collection: next[key] });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const auth = await requireUser('admin');
  if (isDenied(auth)) return auth.response;

  const { collection, id } = await ctx.params;
  const key = parse(collection);
  if (!key) return unknown(collection);

  let found = false;
  const next = await updateConfig((config) => {
    const list = listOf(config, key);
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) {
      found = true;
      const [removed] = list.splice(i, 1);
      // Never leave the set without a primary.
      if (key === 'bankDetails' && removed.primary && list.length) {
        list[0].primary = true;
      }
    }
    return config;
  });

  if (!found) return NextResponse.json({ error: `No '${collection}' with id '${id}'` }, { status: 404 });
  return NextResponse.json({ collection: next[key] });
}
