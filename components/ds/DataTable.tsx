'use client';

import { useMemo, useState } from 'react';
import { Icon } from './Icon';
import t from '@/components/dashboard/TransactionsTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  /** Render the cell. Falls back to the raw value at `key`. */
  cell?: (row: T) => React.ReactNode;
  /** Value used for sorting; enables the sort control on this column. */
  sortValue?: (row: T) => string | number;
  numeric?: boolean;
  muted?: boolean;
}

export function DataTable<T>({
  rows,
  columns,
  searchable,
  searchKeys,
  emptyMessage = 'Nothing here yet.',
  countLabel,
}: {
  rows: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (row: T) => string;
  emptyMessage?: string;
  countLabel?: (n: number) => string;
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);

  const view = useMemo(() => {
    let out = rows;

    if (query.trim() && searchKeys) {
      const q = query.toLowerCase();
      out = out.filter((r) => searchKeys(r).toLowerCase().includes(q));
    }

    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        const dir = sort.dir === 'asc' ? 1 : -1;
        out = [...out].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
          return String(av).localeCompare(String(bv)) * dir;
        });
      }
    }

    return out;
  }, [rows, columns, query, sort, searchKeys]);

  function toggleSort(key: string) {
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' },
    );
  }

  return (
    <div className={t.wrap}>
      {searchable && (
        <div className={t.toolbar}>
          <input
            className={t.searchInput}
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <span className={t.count}>
            {countLabel ? countLabel(view.length) : `${view.length} items`}
          </span>
        </div>
      )}

      <div className={t.scroll}>
        <table className={t.table}>
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                const cls = [c.sortValue && t.sortable, c.numeric && t.numeric].filter(Boolean).join(' ');
                return (
                  <th
                    key={c.key}
                    className={cls || undefined}
                    onClick={c.sortValue ? () => toggleSort(c.key) : undefined}
                    aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    {c.header}
                    {c.sortValue && (
                      <span className={[t.sortIcon, active && t.sortActive].filter(Boolean).join(' ')}>
                        <Icon name={active && sort!.dir === 'asc' ? 'arrow-up-right' : 'chevron-down'} size={11} />
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {view.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[c.numeric && t.numeric, c.muted && t.muted].filter(Boolean).join(' ') || undefined}
                  >
                    {c.cell ? c.cell(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {view.length === 0 && <div className={t.empty}>{emptyMessage}</div>}
      </div>
    </div>
  );
}

/** Small round avatar carrying a name's initials. */
export function Avatar({ name }: { name: string }) {
  const initials = name
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return <span className={t.avatar}>{initials}</span>;
}

export function NameCell({ name }: { name: string }) {
  return (
    <span className={t.party}>
      <Avatar name={name} />
      <span className={t.partyName}>{name}</span>
    </span>
  );
}

const NEGATIVE = /overdue|declined|failed|error|expired|suspended|action required|invalid|missing/i;
const POSITIVE = /paid|active|approved|completed|opened|success|sent/i;
const NEUTRAL = /pending|processing|review|scheduled|draft|started|applied|upcoming/i;

/** Status chip. Colour is derived from the word, so new statuses degrade gracefully. */
export function Status({ value }: { value: string | null | undefined }) {
  if (!value) return <span className={t.muted}>—</span>;
  const cls = NEGATIVE.test(value)
    ? t.statusFailed
    : NEUTRAL.test(value)
      ? t.statusPending
      : POSITIVE.test(value)
        ? t.statusOk
        : t.statusNeutral;
  return <span className={`${t.status} ${cls}`}>{value}</span>;
}
