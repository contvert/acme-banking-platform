'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ds/Icon';
import { applyTheme, readStoredTheme, storeTheme, type Theme } from '@/lib/theme';
import type { Message } from '@/lib/i18n/messages/catalog';
import { useDismissable } from './useDismissable';
import { useT } from '@/components/i18n/I18nProvider';
import s from './ThemeToggle.module.css';

const OPTIONS: { value: Theme; label: Message; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'computer' },
];

export function ThemeToggle() {
  // Start at 'system' so server and first client render agree; the real value
  // is read in the effect below. The pre-paint script has already painted it.
  const [theme, setTheme] = useState<Theme>('system');
  const { open, setOpen, ref, toggle } = useDismissable();
  const t = useT();

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    storeTheme(next);
    applyTheme(next);
    setOpen(false);
  }

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];

  return (
    <div className={s.wrap} ref={ref}>
      <button
        className={s.trigger}
        type="button"
        aria-label={t('Theme: {name}', { name: t(current.label) })}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <Icon name={current.icon} size={16} />
      </button>

      {open && (
        <div className={s.menu} role="menu">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              className={s.item}
              role="menuitemradio"
              aria-checked={theme === o.value}
              onClick={() => choose(o.value)}
            >
              <Icon name={o.icon} size={14} />
              <span className={s.itemLabel}>{t(o.label)}</span>
              {theme === o.value && <Icon name="check" size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
