'use client';

import { Icon } from '@/components/ds/Icon';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { AccountMenu } from './AccountMenu';
import { MoveMoneyMenu } from './MoveMoneyMenu';
import { useShell } from './ShellContext';
import { useT } from '@/components/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import s from './TopBar.module.css';

export function TopBar() {
  const { toggleNav, navOpen, privateMode, togglePrivate } = useShell();
  const t = useT();

  return (
    <>
      <div className={s.bar}>
        <button
          className={s.menuBtn}
          type="button"
          aria-label={t('Open menu')}
          aria-expanded={navOpen}
          onClick={toggleNav}
        >
          <Icon name="bars-filter" size={18} />
        </button>

        {/* Icon-only below 640px; the label is kept for assistive tech. */}
        <button className={s.search} type="button" aria-label={t('Search for anything')}>
          <Icon name="magnifying-glass" size={16} />
          <span className={s.searchLabel}>{t('Search for anything')}</span>
          <span className={s.kbd}>⌘K</span>
        </button>

        <span className={s.spacer} />

        <button
          className={s.iconBtn}
          type="button"
          aria-label={t('Toggle private mode')}
          aria-pressed={privateMode}
          onClick={togglePrivate}
        >
          <Icon name={privateMode ? 'eye-slash' : 'eye'} size={16} />
        </button>
        <LanguageSwitcher />
        <ThemeToggle />
        <MoveMoneyMenu />
        <Link className={s.iconBtn} href="/settings" aria-label={t('Settings')}>
          <Icon name="gear" size={16} />
        </Link>
        <AccountMenu />
      </div>
    </>
  );
}
