'use client';

import { Page, SectionTitle, Money } from '@/components/ds/Page';
import { DataTable, Status, type Column } from '@/components/ds/DataTable';
import { CHECKS, type Check } from '@/lib/mock/checks';

const columns: Column<Check>[] = [
  { key: 'checkNo', header: 'Check no.', sortValue: (r) => r.checkNo },
  { key: 'received', header: 'Date received', sortValue: (r) => r.received, muted: true },
  {
    key: 'amount', header: 'Amount', numeric: true,
    sortValue: (r) => r.amount ?? 0,
    cell: (r) => <Money value={r.amount} />,
  },
  { key: 'payFrom', header: 'Pay from', muted: true },
  { key: 'reviewStatus', header: 'Review status', cell: (r) => <Status value={r.reviewStatus} /> },
];

export default function CheckbooksPage() {
  return (
    <Page
      title="Checkbooks"
      actions={[
        { label: 'Settings', icon: 'gear', href: '/checkbooks/settings' },
        { label: 'Order Checkbook', icon: 'money-check', primary: true, href: '/checkbooks/settings' },
      ]}
    >
      <SectionTitle>Checks needing review</SectionTitle>
      <DataTable
        rows={CHECKS}
        columns={columns}
        countLabel={(n) => `${n} ${n === 1 ? 'check' : 'checks'}`}
      />
    </Page>
  );
}
