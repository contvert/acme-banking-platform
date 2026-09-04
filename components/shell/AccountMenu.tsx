'use client';

import Link from 'next/link';
import { Icon } from '@/components/ds/Icon';
import { ACCOUNT_MENU } from '@/lib/mock/nav';
import { USER } from '@/lib/mock/dashboard';
import { BRAND } from '@/lib/brand';
import { useRouter } from 'next/navigation';
import { useConfig } from '@/components/config/ConfigProvider';
import { useDismissable } from './useDismissable';
import s from './AccountMenu.module.css';

/** Avatar in the top bar, opening the account/settings menu the reference carries. */
export function AccountMenu() {
  const { open, setOpen, ref, toggle } = useDismissable();
  const { user, isAdmin } = useConfig();
  const router = useRouter();

  const name = user?.displayName ?? `${USER.firstName} ${USER.lastName}`;
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const profileHref = isAdmin ? '/settings/my-profile' : '/profile';

  return (
    <div className={s.wrap} ref={ref}>
      <button
        className={s.trigger}
        type="button"
        aria-label={`Account menu for ${name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className={s.avatar}>{initials}</span>
      </button>

      {open && (
        <div className={s.menu} role="menu">
          <Link href={profileHref} className={s.identity} role="menuitem">
            <span className={s.avatarLg}>{initials}</span>
            <span className={s.identityText}>
              <span className={s.identityName}>{name}</span>
              <span className={s.identityOrg}>{BRAND.productName}</span>
            </span>
          </Link>

          <div className={s.divider} />

          <Link href={profileHref} className={s.item} role="menuitem">
            <Icon name="user" size={15} />
            <span className={s.itemLabel}>Mon profil</span>
          </Link>

          {isAdmin && ACCOUNT_MENU.map((m) => (
            <Link key={m.href} href={m.href} className={s.item} role="menuitem">
              <Icon name={m.icon} size={15} />
              <span className={s.itemLabel}>{m.label}</span>
              {m.badge && <span className={s.badge}>{m.badge}</span>}
            </Link>
          ))}

          {isAdmin && (
            <Link href="/admin" className={s.item} role="menuitem">
              <Icon name="gear" size={15} />
              <span className={s.itemLabel}>Administration</span>
            </Link>
          )}

          <div className={s.divider} />

          <button
            type="button"
            className={s.item}
            role="menuitem"
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.replace('/login');
              router.refresh();
            }}
          >
            <Icon name="arrow-right-from-bracket" size={15} />
            <span className={s.itemLabel}>Se déconnecter</span>
          </button>
        </div>
      )}
    </div>
  );
}
