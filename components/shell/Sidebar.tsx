'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ds/Icon';
import { PRIMARY_NAV, BOOKMARKS, type NavItem } from '@/lib/mock/nav';
import { useConfig } from '@/components/config/ConfigProvider';
import { useShell } from './ShellContext';
import s from './Sidebar.module.css';

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === '/' || pathname === '/dashboard';
  return pathname === href || pathname.startsWith(href + '/');
}

function Badge({ value }: { value: string }) {
  const isNew = value.toLowerCase() === 'new';
  return <span className={[s.badge, isNew && s.badgeNew].filter(Boolean).join(' ')}>{value}</span>;
}

function Item({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href);
  return (
    <>
      <Link href={item.href} className={[s.item, active && s.active].filter(Boolean).join(' ')}>
        <span className={s.itemIcon}><Icon name={item.icon} size={15} /></span>
        <span className={s.itemLabel}>{item.label}</span>
        {item.badge && <Badge value={item.badge} />}
      </Link>
      {item.children && active && (
        <div className={s.children}>
          <span className={s.rail} />
          {item.children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={[s.l2, isActive(pathname, c.href) && s.active].filter(Boolean).join(' ')}
            >
              <span className={s.itemLabel}>{c.label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { navOpen, closeNav } = useShell();
  const { config, money } = useConfig();

  return (
    <>
      <button
        className={[s.scrim, navOpen && s.open].filter(Boolean).join(' ')}
        aria-hidden={!navOpen}
        tabIndex={-1}
        onClick={closeNav}
      />
      <nav
        className={[s.sidebar, navOpen && s.open].filter(Boolean).join(' ')}
        aria-label="Main"
        aria-hidden={undefined}
      >
      <button className={s.org} type="button">
        <span className={s.orgMark}>{config.company.name.charAt(0)}</span>
        <span className={s.orgName}>{config.company.name}</span>
        <span className={s.orgPlan}>{config.company.plan}</span>
      </button>
      <button className={s.closeBtn} type="button" aria-label="Close menu" onClick={closeNav}>
        <Icon name="xmark" size={18} />
      </button>

      <div className={s.scroll}>
        {PRIMARY_NAV.map((item) => (
          <Item key={item.href} item={item} pathname={pathname} />
        ))}

        <div className={s.sectionLabel}>
          <span>Bookmarks</span>
          <Icon name="circle-info" size={12} />
        </div>
        {BOOKMARKS.map((b) => {
          const account = config.accounts.find((a) => a.name === b.label);
          return (
            <Link
              key={b.label}
              href={b.href}
              className={[s.item, s.bookmark, isActive(pathname, b.href) && s.active].filter(Boolean).join(' ')}
            >
              <span className={s.itemIcon}><Icon name="bookmark" size={15} /></span>
              <span className={s.bookmarkText}>
                <span className={s.bookmarkLabel}>{b.label}</span>
                {account && (
                  <span className={s.bookmarkValue}>{money(account.balance, account.currency)}</span>
                )}
              </span>
            </Link>
          );
        })}
      </div>

      </nav>
    </>
  );
}
