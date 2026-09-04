'use client';

import { Page, StatTiles, useTabs, Money, Empty } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { Icon } from '@/components/ds/Icon';
import { BUDGETS, SPEND_SUMMARY, REVIEW_REQUIRED, type Budget } from '@/lib/mock/teamSpend';
import t from '@/components/dashboard/TransactionsTable.module.css';
import p from '@/components/ds/Page.module.css';

const columns: Column<Budget>[] = [
  {
    key: 'name',
    header: 'Name',
    sortValue: (r) => r.name,
    cell: (r) => (
      <>
        {r.name}
        {r.upcoming && <span className={`${t.status} ${t.statusNeutral}`}>Upcoming</span>}
      </>
    ),
  },
  {
    key: 'limit',
    header: 'Spend limit',
    numeric: true,
    sortValue: (r) => r.limit ?? 0,
    cell: (r) => (
      <>
        <Money value={r.limit} /> <span className={t.muted}>{r.cycle}</span>
      </>
    ),
  },
  {
    key: 'spentPct',
    header: 'Spend cycle',
    sortValue: (r) => r.spentPct,
    cell: (r) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span
          aria-hidden
          style={{
            width: 60, height: 5, borderRadius: 9999,
            background: 'var(--ds-background-secondary)', overflow: 'hidden', display: 'inline-block',
          }}
        >
          <span
            style={{
              display: 'block', height: '100%', width: `${r.spentPct}%`,
              background: 'var(--ds-data-visualization-segment-primary)',
            }}
          />
        </span>
        <span className={t.muted}>{r.spentPct}% spent</span>
      </span>
    ),
  },
  {
    key: 'assigned',
    header: 'Assigned to',
    muted: true,
    cell: (r) => (r.assignedExtra ? `+${r.assignedExtra}` : '—'),
  },
];

export default function TeamSpendPage() {
  const tabs = useTabs([
    { label: 'Employee budgets', count: BUDGETS.length },
    { label: 'Team members' },
    { label: 'Status' },
    { label: 'Active dates' },
  ]);

  return (
    <Page
      title="Team Spend"
      pill="Beta"
      actions={[{ label: 'Create budget', icon: 'plus', primary: true, href: '/team-spend/budget/create' }]}
    >
      <StatTiles
        tiles={[
          {
            label: 'Budget spend summary',
            value: <Money value={SPEND_SUMMARY.total} />,
            meta: SPEND_SUMMARY.period,
          },
          {
            label: 'Review required',
            value: REVIEW_REQUIRED.expenses,
            meta: `${REVIEW_REQUIRED.expenses} expenses · ${REVIEW_REQUIRED.receiptExceptions} receipt exception request`,
          },
          {
            label: 'Categories',
            value: SPEND_SUMMARY.categories.length,
            meta: SPEND_SUMMARY.categories.join(' · '),
          },
        ]}
      />

      {tabs.node}

      {tabs.active === 'Employee budgets' ? (
        <DataTable rows={BUDGETS} columns={columns} />
      ) : (
        <Empty>
          <Icon name="circle-info" size={16} />
          <div style={{ marginTop: 8 }}>Nothing to show under {tabs.active}.</div>
        </Empty>
      )}
      <p className={p.tileMeta} style={{ marginTop: 12 }}>
        Budgets shown are sample data.
      </p>
    </Page>
  );
}
