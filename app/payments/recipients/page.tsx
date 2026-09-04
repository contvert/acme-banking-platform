'use client';

import { Page, useTabs, Money } from '@/components/ds/Page';
import { DataTable, Status, NameCell, type Column } from '@/components/ds/DataTable';
import { RECIPIENTS, type Recipient } from '@/lib/mock/recipients';

const columns: Column<Recipient>[] = [
  { key: 'name', header: 'Name', sortValue: (r) => r.name, cell: (r) => <NameCell name={r.name} /> },
  {
    key: 'totalPaid', header: 'Total paid', numeric: true,
    sortValue: (r) => r.totalPaid ?? 0,
    cell: (r) => <Money value={r.totalPaid} />,
  },
  { key: 'lastPaid', header: 'Last paid', sortValue: (r) => r.lastPaid, muted: true },
  { key: 'status', header: 'Status', cell: (r) => <Status value={r.status} /> },
];

export default function RecipientsPage() {
  const tabs = useTabs([
    { label: 'All', count: RECIPIENTS.length },
    { label: 'Has Tax Docs' },
    { label: 'Needs Tax Docs' },
  ]);

  return (
    <Page
      title="Recipients"
      actions={[{ label: 'Create recipient', icon: 'user-plus', primary: true, href: '/payments/recipients/create/request' }]}
    >
      {tabs.node}
      <DataTable
        rows={RECIPIENTS}
        columns={columns}
        searchable
        searchKeys={(r) => r.name}
        countLabel={(n) => `${n} ${n === 1 ? 'recipient' : 'recipients'}`}
      />
    </Page>
  );
}
