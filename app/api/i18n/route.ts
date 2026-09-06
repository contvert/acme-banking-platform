import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { foreignOrigin } from '@/lib/http/origin';
import {
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_META,
} from '@/lib/i18n/locales';
import { getTranslator } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

/**
 * Records the reader's language. Deliberately open to signed-out visitors:
 * the sign-in page has to be readable before there is a session to attach a
 * preference to.
 */
export async function POST(request: Request) {
  const t = await getTranslator();
  if (foreignOrigin(request)) {
    return NextResponse.json({ error: t('Invalid request origin.') }, { status: 403 });
  }

  let body: { locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t('Body must be JSON.') }, { status: 400 });
  }

  if (!isLocale(body.locale)) {
    return NextResponse.json({ error: t('Unsupported language') }, { status: 400 });
  }

  (await cookies()).set(LOCALE_COOKIE, body.locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
    // Readable by the server on the first paint; there is nothing secret in a
    // language choice, and no script needs to read it.
    httpOnly: true,
  });

  return NextResponse.json({ locale: body.locale, tag: LOCALE_META[body.locale].tag });
}
