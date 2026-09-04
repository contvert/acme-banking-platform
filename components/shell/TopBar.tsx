'use client';

import { useState } from 'react';
import { Icon } from '@/components/ds/Icon';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { AccountMenu } from './AccountMenu';
import { MoveMoneyMenu } from './MoveMoneyMenu';
import { useShell } from './ShellContext';
import s from './TopBar.module.css';

export function TopBar() {
  const [privateMode, setPrivateMode] = useState(false);
  const { toggleNav, navOpen } = useShell();

  return (
    <>
      <div className={s.bar}>
        <button
          className={s.menuBtn}
          type="button"
          aria-label="Open menu"
          aria-expanded={navOpen}
          onClick={toggleNav}
        >
          <Icon name="bars-filter" size={18} />
        </button>

        {/* Icon-only below 640px; the label is kept for assistive tech. */}
        <button className={s.search} type="button" aria-label="Search for anything">
          <Icon name="magnifying-glass" size={16} />
          <span className={s.searchLabel}>Search for anything</span>
          <span className={s.kbd}>⌘K</span>
        </button>

        <span className={s.spacer} />

        <button
          className={s.iconBtn}
          type="button"
          aria-label="Toggle private mode"
          aria-pressed={privateMode}
          onClick={() => setPrivateMode((v) => !v)}
        >
          <Icon name={privateMode ? 'eye-slash' : 'eye'} size={16} />
        </button>
        <ThemeToggle />
        <button className={s.iconBtn} type="button" aria-label="Notifications">
          <Icon name="bell" size={16} />
        </button>
        <MoveMoneyMenu />
        <Link className={s.iconBtn} href="/settings" aria-label="Settings">
          <Icon name="gear" size={16} />
        </Link>
        <AccountMenu />
      </div>
    </>
  );
}
