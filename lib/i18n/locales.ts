/**
 * The languages the interface speaks. English is the source language: every
 * string in the code is written in it, and the other catalogues translate it.
 *
 * The locale lives in a cookie rather than in the URL. Every route here sits
 * behind a sign-in, so there is nothing to index and no reason for a visitor
 * to share a link in one language rather than another — while a `/[lang]`
 * segment would rewrite every internal link, redirect and route guard in the
 * project for no benefit the reader would ever see.
 */

export const LOCALES = ['en', 'fr', 'it', 'pt', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Host-only, readable by the server on the first paint, kept for a year. */
export const LOCALE_COOKIE = 'Mercury_locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export interface LocaleMeta {
  code: Locale;
  /** The language's name in itself — how a speaker expects to find it. */
  endonym: string;
  /** The same name in English, for accessible descriptions. */
  english: string;
  /** ISO 3166-1 alpha-2 country whose flag stands for the language. */
  country: 'GB' | 'FR' | 'IT' | 'PT' | 'ES';
  /** BCP 47 tag for Intl formatting. */
  tag: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { code: 'en', endonym: 'English', english: 'English', country: 'GB', tag: 'en-US' },
  fr: { code: 'fr', endonym: 'Français', english: 'French', country: 'FR', tag: 'fr-FR' },
  it: { code: 'it', endonym: 'Italiano', english: 'Italian', country: 'IT', tag: 'it-IT' },
  pt: { code: 'pt', endonym: 'Português', english: 'Portuguese', country: 'PT', tag: 'pt-PT' },
  es: { code: 'es', endonym: 'Español', english: 'Spanish', country: 'ES', tag: 'es-ES' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Picks the best supported language from an `Accept-Language` header, so a
 * first-time visitor is greeted in their own language when we speak it.
 * Quality values are honoured; anything unrecognised falls through to English.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
        ?.slice(2);
      const quality = q === undefined ? 1 : Number.parseFloat(q);
      return { tag: tag.trim().toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 };
    })
    .filter((entry) => entry.tag && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    // `pt-BR` and `pt` both mean Portuguese to us.
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}
