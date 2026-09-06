import type { Message } from './messages/catalog';
import { DEFAULT_LOCALE, type Locale } from './locales';

/**
 * A locale's strings, keyed by their English source. English needs no table:
 * the key is already the answer, so nothing is shipped for it.
 */
export type Catalog = Partial<Record<Message, string>>;

export type Translate = (message: Message, values?: Record<string, string | number>) => string;

/**
 * Translates a string that is not known to be catalogued — a status word that
 * arrives with a record, say. Catalogued text is translated; anything else is
 * returned untouched, which is the right answer for content.
 */
export type TranslateLoose = (value: string) => string;

/** Fills `{name}` placeholders. Anything unmatched is left visible on purpose. */
function interpolate(text: string, values?: Record<string, string | number>) {
  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  );
}

/**
 * Builds the `t` used by both server and client code. A missing translation
 * falls back to the English source, which is always a sentence rather than
 * a key — a gap reads as untranslated, never as broken.
 */
export function makeTranslator(catalog: Catalog): Translate {
  return (message, values) => interpolate(catalog[message] ?? message, values);
}

export function makeLooseTranslator(catalog: Catalog): TranslateLoose {
  return (value) => catalog[value as Message] ?? value;
}

/** Formatting tag for `Intl`, used for dates and non-monetary numbers. */
export function localeTag(locale: Locale) {
  return locale === DEFAULT_LOCALE ? 'en-US' : locale;
}
