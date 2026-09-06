'use client';

import { Icon } from '@/components/ds/Icon';
import { useDismissable } from '@/components/shell/useDismissable';
import { LOCALES, LOCALE_META, type Locale } from '@/lib/i18n/locales';
import { Flag } from './Flag';
import { useI18n } from './I18nProvider';
import { useSetLocale } from './useSetLocale';
import s from './LanguageSwitcher.module.css';

/**
 * The language picker. The trigger shows the flag of the language in use, so
 * the control says what it does without needing a label — and each option
 * carries its own name in its own language, which is what a reader looking
 * for their language actually scans for.
 */
export function LanguageSwitcher({ variant = 'bar' }: { variant?: 'bar' | 'standalone' }) {
  const { open, setOpen, ref, toggle } = useDismissable();
  const { locale, t } = useI18n();
  const { setLocale, saving } = useSetLocale();

  const current = LOCALE_META[locale];

  async function choose(next: Locale) {
    if (next === locale) {
      setOpen(false);
      return;
    }

    if (await setLocale(next)) setOpen(false);
  }

  return (
    <div className={[s.wrap, variant === 'bar' && s.barOnly].filter(Boolean).join(' ')} ref={ref}>
      <button
        className={[s.trigger, variant === 'standalone' && s.standalone].filter(Boolean).join(' ')}
        type="button"
        aria-label={t('Language: {name}', { name: current.endonym })}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <Flag country={current.country} size={18} />
        <span className={s.code}>{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className={s.menu} role="menu" aria-label={t('Choose your language')}>
          <p className={s.menuTitle}>{t('Choose your language')}</p>
          {LOCALES.map((code) => {
            const meta = LOCALE_META[code];
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                className={s.item}
                role="menuitemradio"
                aria-checked={active}
                disabled={saving !== null}
                onClick={() => choose(code)}
              >
                <Flag country={meta.country} size={20} />
                <span className={s.itemLabel}>{meta.endonym}</span>
                {active && <Icon name="check" size={13} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
