'use client';

import Link from 'next/link';
import { Icon } from '@/components/ds/Icon';
import { QUICK_ACTIONS } from '@/lib/mock/nav';
import { useDismissable } from './useDismissable';
import s from './MoveMoneyMenu.module.css';

/**
 * The top bar's primary action. On the original it opens the same five
 * destinations the dashboard offers as pills, with `Upload bill` set apart
 * because it starts from a document rather than an amount.
 */
export function MoveMoneyMenu() {
  const { open, ref, toggle, close } = useDismissable();

  return (
    <div className={s.wrap} ref={ref}>
      <button
        className={s.trigger}
        type="button"
        aria-label="Move money"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <Icon name="arrow-right-arrow-left" size={14} />
        <span className={s.triggerLabel}>Move money</span>
        <Icon name="chevron-down" size={11} />
      </button>

      {open && (
        <div className={s.menu} role="menu">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              role="menuitem"
              className={[s.item, action.label === 'Upload bill' && s.itemDivided]
                .filter(Boolean)
                .join(' ')}
              onClick={close}
            >
              <Icon name={action.icon} size={15} />
              <span className={s.itemLabel}>{action.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
