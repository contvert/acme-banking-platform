import 'server-only';

import { cookies, headers } from 'next/headers';
import { catalogFor } from './catalogs';
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  negotiateLocale,
  type Locale,
} from './locales';
import { makeTranslator, type Translate } from './translate';

/**
 * The language for this request: an explicit choice first, then what the
 * browser asks for, then English. Resolving it on the server means the first
 * paint is already in the right language — no flash of English, and no
 * client-side round trip before the sidebar reads correctly.
 */
export async function getLocale(): Promise<Locale> {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(stored)) return stored;

  const accept = (await headers()).get('accept-language');
  return negotiateLocale(accept) ?? DEFAULT_LOCALE;
}

/** `t` for server components and server-side utilities. */
export async function getTranslator(): Promise<Translate> {
  return makeTranslator(catalogFor(await getLocale()));
}
