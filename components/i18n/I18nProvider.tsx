'use client';

import { createContext, useContext, useMemo } from 'react';
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from '@/lib/i18n/locales';
import {
  makeLooseTranslator,
  makeTranslator,
  localeTag,
  type Catalog,
  type Translate,
  type TranslateLoose,
} from '@/lib/i18n/translate';

interface I18nValue {
  locale: Locale;
  /** BCP 47 tag for `Intl` — dates, lists, non-monetary numbers. */
  tag: string;
  t: Translate;
  /** For strings that arrive with data rather than from the source. */
  tx: TranslateLoose;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Carries the active language into the client tree. The catalogue arrives as a
 * prop from the server layout rather than being imported here, so a visitor
 * downloads the one language they are reading and not the other four.
 */
export function I18nProvider({
  locale,
  catalog,
  children,
}: {
  locale: Locale;
  catalog: Catalog;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      tag: localeTag(locale),
      t: makeTranslator(catalog),
      tx: makeLooseTranslator(catalog),
    }),
    [locale, catalog],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  // Outside the provider — a test harness, a stray render — English is right.
  if (!value) {
    return {
      locale: DEFAULT_LOCALE,
      tag: LOCALE_META[DEFAULT_LOCALE].tag,
      t: makeTranslator({}),
      tx: makeLooseTranslator({}),
    };
  }
  return value;
}

/** The common case: `const t = useT();` then `t('Move money')`. */
export function useT(): Translate {
  return useI18n().t;
}

/** For labels that arrive with a record — translated when catalogued. */
export function useTx(): TranslateLoose {
  return useI18n().tx;
}
