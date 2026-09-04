'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/shell/TopBar';
import { Icon } from './Icon';
import { Money, MoneyCompact } from './Money';
import s from './Page.module.css';

export interface PageAction {
  label: string;
  icon?: string;
  primary?: boolean;
  /** Where the action goes. Without it the action renders as a plain button. */
  href?: string;
  onClick?: () => void;
}

/** Standard page frame: top bar, title row, optional actions. */
export function Page({
  title,
  pill,
  actions,
  children,
}: {
  title: string;
  pill?: string;
  actions?: PageAction[];
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <main className={s.page}>
        <header className={s.head}>
          <h1 className={s.title}>{title}</h1>
          {pill && <span className={s.pill}>{pill}</span>}
          {actions && actions.length > 0 && (
            <div className={s.headActions}>
              {actions.map((a) => {
                const cls = [s.btn, a.primary && s.btnPrimary].filter(Boolean).join(' ');
                const body = (
                  <>
                    {a.icon && <Icon name={a.icon} size={13} />}
                    {a.label}
                  </>
                );
                return a.href ? (
                  <Link key={a.label} href={a.href} className={cls}>{body}</Link>
                ) : (
                  <button key={a.label} type="button" className={cls} onClick={a.onClick}>
                    {body}
                  </button>
                );
              })}
            </div>
          )}
        </header>
        {children}
      </main>
    </>
  );
}

export interface TabDef {
  label: string;
  count?: number | null;
}

/** Tab strip. Controlled by the caller so pages can filter their own data. */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (label: string) => void;
}) {
  return (
    <div className={s.tabs} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.label}
          role="tab"
          aria-selected={active === t.label}
          className={s.tab}
          onClick={() => onChange(t.label)}
        >
          {t.label}
          {t.count != null && <span className={s.tabCount}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Uncontrolled convenience wrapper for pages that only need local tab state. */
export function useTabs(tabs: TabDef[]) {
  const [active, setActive] = useState(tabs[0]?.label ?? '');
  return { active, setActive, node: <Tabs tabs={tabs} active={active} onChange={setActive} /> };
}

export interface TileDef {
  label: string;
  value: React.ReactNode;
  meta?: React.ReactNode;
}

export function StatTiles({ tiles }: { tiles: TileDef[] }) {
  return (
    <div className={s.tiles}>
      {tiles.map((t) => (
        <div key={t.label} className={s.tile}>
          <div className={s.tileLabel}>{t.label}</div>
          <div className={s.tileValue}>{t.value}</div>
          {t.meta && <div className={s.tileMeta}>{t.meta}</div>}
        </div>
      ))}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.note}>
      <Icon name="circle-info" size={15} />
      <span>{children}</span>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={s.sectionTitle}>{children}</h2>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className={s.empty}>{children}</div>;
}

export { Money, MoneyCompact };
export const pageStyles = s;
