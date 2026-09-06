import type { Catalog } from './translate';
import { DEFAULT_LOCALE, type Locale } from './locales';
import { fr } from './messages/fr';
import { it } from './messages/it';
import { pt } from './messages/pt';
import { es } from './messages/es';

/**
 * English is the source language, so it needs no table: `t('Move money')`
 * already holds the answer. Only the active locale's catalogue is handed to
 * the browser, and English hands over nothing at all.
 */
const CATALOGS: Record<Locale, Catalog> = {
  en: {},
  fr,
  it,
  pt,
  es,
};

export function catalogFor(locale: Locale): Catalog {
  return CATALOGS[locale] ?? CATALOGS[DEFAULT_LOCALE];
}
