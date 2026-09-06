'use client';

import { Page, StatTiles, useTabs, Money, MoneyCompact } from '@/components/ds/Page';
import { DataTable, Status, type Column } from '@/components/ds/DataTable';
import { INVOICES, INVOICE_SUMMARY, type Invoice } from '@/lib/mock/invoices';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<Invoice>[] = [
  { key: 'dueDate', header: 'Due date', sortValue: (r) => r.dueDate, muted: true },
  { key: 'status', header: 'Status', sortValue: (r) => r.status, cell: (r) => <Status value={r.status} /> },
  {
    key: 'customer',
    header: 'Customer',
    sortValue: (r) => r.customer,
    cell: (r) => (
      <span>
        <span style={{ display: 'block' }}>{r.customer}</span>
        {r.email && <span className={t.muted} style={{ fontSize: 13 }}>{r.email}</span>}
      </span>
    ),
  },
  {
    key: 'amount', header: 'Amount', numeric: true,
    sortValue: (r) => r.amount ?? 0,
    cell: (r) => <Money value={r.amount} />,
  },
  { key: 'invoiceNo', header: 'Invoice no.', muted: true, sortValue: (r) => r.invoiceNo },
  { key: 'invoiceDate', header: 'Invoice date', muted: true },
  { key: 'type', header: 'Type', muted: true },
];

const TABS = ['All', 'Overdue', 'Scheduled', 'Active', 'Paid'];

export default function InvoicingPage() {
  const translate = useT();
  const tabs = useTabs(TABS.map((label) => ({ label })));
  const rows =
    tabs.active === 'All'
      ? INVOICES
      : INVOICES.filter((i) => i.status.toLowerCase() === tabs.active.toLowerCase());

  return (
    <Page
      title={translate('Invoicing')}
      pill="Pro"
      actions={[
        { label: translate('Invoice settings'), icon: 'gear', href: '/invoicing/invoice-settings' },
        { label: translate('Request money'), icon: 'envelope-open-dollar', primary: true, href: '/invoicing/create-invoice' },
      ]}
    >
      <StatTiles
        tiles={[
          {
            label: translate('Total open'),
            value: <MoneyCompact value={INVOICE_SUMMARY.open} />,
            meta: `${INVOICE_SUMMARY.openInvoices} invoices · ${INVOICE_SUMMARY.openLinks} payment link`,
          },
          {
            label: translate('Overdue'),
            value: <MoneyCompact value={INVOICE_SUMMARY.overdue} />,
            meta: `${INVOICE_SUMMARY.overdueInvoices} invoices`,
          },
          {
            label: translate('Paid'),
            value: <MoneyCompact value={INVOICE_SUMMARY.paid} />,
            meta: `${INVOICE_SUMMARY.paidInvoices} invoices · ${INVOICE_SUMMARY.paidLinks} payment link`,
          },
        ]}
      />

      {tabs.node}

      <DataTable
        rows={rows}
        columns={columns}
        searchable
        searchKeys={(r) => `${r.customer} ${r.email ?? ''} ${r.invoiceNo} ${r.status}`}
        countLabel={(n) => `${n} ${n === 1 ? 'invoice' : 'invoices'}`}
        emptyMessage="No invoices with this status."
      />
    </Page>
  );
}
