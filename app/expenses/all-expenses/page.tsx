'use client';

import { Page, useTabs, Money } from '@/components/ds/Page';
import { DataTable, Status, NameCell, type Column } from '@/components/ds/DataTable';
import { EXPENSES, type Expense } from '@/lib/mock/expenses';

const columns: Column<Expense>[] = [
  { key: 'date', header: 'Date', sortValue: (r) => r.date, muted: true },
  { key: 'member', header: 'Team Member', sortValue: (r) => r.member, cell: (r) => <NameCell name={r.member} /> },
  { key: 'status', header: 'Status', sortValue: (r) => r.status, cell: (r) => <Status value={r.status} /> },
  { key: 'amount', header: 'Amount', numeric: true, sortValue: (r) => r.amount ?? 0, cell: (r) => <Money value={r.amount} /> },
  { key: 'category', header: 'Category', muted: true, sortValue: (r) => r.category },
  { key: 'budget', header: 'Budget', muted: true, cell: (r) => r.budget ?? '—' },
];

export default function ReimbursementsPage() {
  const mine = EXPENSES.filter((e) => e.member === 'Jane Black');
  const tabs = useTabs([
    { label: 'All expenses', count: EXPENSES.length },
    { label: 'My expenses', count: mine.length },
  ]);

  const rows = tabs.active === 'My expenses' ? mine : EXPENSES;

  return (
    <Page
      title="Reimbursements"
      actions={[
        { label: 'Settings', icon: 'gear', href: '/team-spend/policies/reimbursements' },
        { label: 'Submit expense', icon: 'plus', primary: true, href: '/send-money/pay/start' },
      ]}
    >
      {tabs.node}
      <DataTable
        rows={rows}
        columns={columns}
        searchable
        searchKeys={(r) => `${r.member} ${r.category} ${r.status}`}
        countLabel={(n) => `${n} ${n === 1 ? 'expense' : 'expenses'}`}
      />
    </Page>
  );
}
