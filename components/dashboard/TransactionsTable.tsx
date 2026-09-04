'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/ds/Icon';
import { Money } from '@/components/ds/Money';
import type { Transaction } from '@/lib/mock/transactions';
import { useTransactions } from '@/lib/config/adapters';
import { TRANSACTION_VIEWS } from '@/lib/mock/dashboard';
import s from './TransactionsTable.module.css';

type SortKey = 'date' | 'party' | 'amount' | 'account';
type Dir = 'asc' | 'desc';

const initials = (name: string) =>
  name.replace(/^(To|From)\s+/i, '').replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** Reference dates are "Mon D" with no year; parse against the reference's own clock. */
function dateValue(d: string) {
  const t = Date.parse(`${d}, 2026`);
  return Number.isNaN(t) ? 0 : t;
}

function applyView(rows: Transaction[], view: string) {
  switch (view) {
    case 'My transactions':
      return rows.filter((r) => /Jane B\./.test(r.method));
    case 'Monthly money in':
      return rows.filter((r) => (r.amount ?? 0) > 0);
    case 'Monthly money out':
      return rows.filter((r) => (r.amount ?? 0) < 0);
    case 'Operating expenses':
      return rows.filter((r) => (r.amount ?? 0) < 0 && r.account === 'Ops / Payroll');
    default:
      return rows;
  }
}

export function TransactionsTable({
  limit,
  showToolbar = false,
  showViews = true,
}: {
  limit?: number;
  showToolbar?: boolean;
  showViews?: boolean;
}) {
  const TRANSACTIONS = useTransactions();
  const [view, setView] = useState<string>(TRANSACTION_VIEWS[0]);
  const [sort, setSort] = useState<{ key: SortKey; dir: Dir }>({ key: 'date', dir: 'desc' });
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    let out = applyView(TRANSACTIONS, view);

    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (r) =>
          r.party.toLowerCase().includes(q) ||
          r.account.toLowerCase().includes(q) ||
          r.method.toLowerCase().includes(q),
      );
    }

    const dir = sort.dir === 'asc' ? 1 : -1;
    out = [...out].sort((a, b) => {
      switch (sort.key) {
        case 'amount':
          return ((a.amount ?? 0) - (b.amount ?? 0)) * dir;
        case 'party':
          return a.party.localeCompare(b.party) * dir;
        case 'account':
          return a.account.localeCompare(b.account) * dir;
        default:
          return (dateValue(a.date) - dateValue(b.date)) * dir;
      }
    });

    return limit ? out.slice(0, limit) : out;
  }, [TRANSACTIONS, view, sort, query, limit]);

  function toggleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' },
    );
  }

  function Th({ label, sortKey, numeric }: { label: string; sortKey?: SortKey; numeric?: boolean }) {
    if (!sortKey) return <th className={numeric ? s.numeric : undefined}>{label}</th>;
    const active = sort.key === sortKey;
    return (
      <th
        className={[s.sortable, numeric && s.numeric].filter(Boolean).join(' ')}
        onClick={() => toggleSort(sortKey)}
        aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        {label}
        <span className={[s.sortIcon, active && s.sortActive].filter(Boolean).join(' ')}>
          <Icon name={active && sort.dir === 'asc' ? 'arrow-up-right' : 'chevron-down'} size={11} />
        </span>
      </th>
    );
  }

  return (
    <div className={s.wrap}>
      {showViews && (
        <div className={s.views} role="tablist" aria-label="Saved views">
          {TRANSACTION_VIEWS.map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={s.view}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {showToolbar && (
        <div className={s.toolbar}>
          <input
            className={s.searchInput}
            placeholder="Search transactions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search transactions"
          />
          <span className={s.count}>
            {rows.length} {rows.length === 1 ? 'transaction' : 'transactions'}
          </span>
        </div>
      )}

      <div className={s.scroll}>
        <table className={s.table}>
          <thead>
            <tr>
              <Th label="Date" sortKey="date" />
              <Th label="To/From" sortKey="party" />
              <Th label="Amount" sortKey="amount" numeric />
              <Th label="Account" sortKey="account" />
              <Th label="Method" />
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={`${t.date}-${t.party}-${i}`}>
                <td className={s.date}>{t.date}</td>
                <td>
                  <span className={s.party}>
                    <span className={s.avatar}>{initials(t.party)}</span>
                    <span className={s.partyName}>{t.party}</span>
                    {t.status === 'failed' && <span className={`${s.status} ${s.statusFailed}`}>Failed</span>}
                    {t.status === 'pending' && <span className={`${s.status} ${s.statusPending}`}>Pending</span>}
                  </span>
                </td>
                <td className={s.numeric}>
                  <Money value={t.amount} tone={(t.amount ?? 0) > 0 ? 'green' : 'default'} />
                </td>
                <td className={s.muted}>{t.account}</td>
                <td className={s.muted}>{t.method}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && <div className={s.empty}>No transactions match this view.</div>}
      </div>
    </div>
  );
}
