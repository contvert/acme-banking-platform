'use client';

import { Page, Money } from '@/components/ds/Page';
import { DataTable, Status, type Column } from '@/components/ds/DataTable';
import { SERIES, type Series } from '@/lib/mock/invoicingExtras';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<Series>[] = [
  {
    key: 'customer', header: 'Customer', sortValue: (r) => r.customer,
    cell: (r) => (
      <span>
        <span style={{ display: 'block' }}>{r.customer}</span>
        {r.email && <span className={t.muted} style={{ fontSize: 13 }}>{r.email}</span>}
      </span>
    ),
  },
  { key: 'seriesId', header: 'Series ID', muted: true, sortValue: (r) => r.seriesId },
  { key: 'status', header: 'Status', cell: (r) => <Status value={r.status} /> },
  { key: 'amount', header: 'Amount', numeric: true, sortValue: (r) => r.amount ?? 0, cell: (r) => <Money value={r.amount} /> },
  {
    key: 'frequency', header: 'Frequency', muted: true,
    cell: (r) => (r.nextOn ? `${r.frequency} · next on ${r.nextOn}` : r.frequency),
  },
];

export default function SeriesPage() {
  const translate = useT();
  return (
    <Page title={translate('Recurring Series')} actions={[{ label: translate('Create series'), icon: 'plus', primary: true, href: '/invoicing/create-invoice' }]}>
      <DataTable rows={SERIES} columns={columns} searchable
        searchKeys={(r) => `${r.customer} ${r.seriesId} ${r.status}`}
        countLabel={(n) => `${n} series`} />
    </Page>
  );
}
