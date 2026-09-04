'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, NameCell, type Column } from '@/components/ds/DataTable';
import { CUSTOMERS, type Customer } from '@/lib/mock/invoicingExtras';

const columns: Column<Customer>[] = [
  { key: 'name', header: 'Name', sortValue: (r) => r.name, cell: (r) => <NameCell name={r.name} /> },
  { key: 'email', header: 'Email', muted: true, sortValue: (r) => r.email },
  { key: 'lastPaid', header: 'Last paid you', muted: true, cell: (r) => r.lastPaid ?? '-' },
];

export default function CustomersPage() {
  return (
    <Page title="Customers" actions={[{ label: 'Add customer', icon: 'user-plus', primary: true, href: '/invoicing/customers/add-customer' }]}>
      <DataTable rows={CUSTOMERS} columns={columns} searchable
        searchKeys={(r) => `${r.name} ${r.email}`}
        countLabel={(n) => `${n} customers`} />
    </Page>
  );
}
