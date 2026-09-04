'use client';

import { Page, Money } from '@/components/ds/Page';
import { DataTable, NameCell, type Column } from '@/components/ds/DataTable';
import { DRAWDOWNS, type Drawdown } from '@/lib/mock/payments';

const columns: Column<Drawdown>[] = [
  { key: 'created', header: 'Created on', muted: true, sortValue: (r) => r.created },
  { key: 'recipient', header: 'Recipient', sortValue: (r) => r.recipient, cell: (r) => <NameCell name={r.recipient} /> },
  {
    key: 'limit', header: 'Withdrawal limit', numeric: true,
    sortValue: (r) => r.limit ?? 0,
    cell: (r) => (r.limit == null ? <span>None</span> : <Money value={r.limit} />),
  },
  { key: 'payFrom', header: 'Pay from', muted: true },
];

export default function WireDrawdownsPage() {
  return (
    <Page title="Wire Drawdowns" actions={[{ label: 'Create authorization', icon: 'plus', primary: true, href: '/wire-drawdowns/recipient-details' }]}>
      <DataTable rows={DRAWDOWNS} columns={columns} countLabel={(n) => `${n} authorizations`} />
    </Page>
  );
}
