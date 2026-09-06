'use client';

import { Page, StatTiles, useTabs, Money, Note } from '@/components/ds/Page';
import { DataTable, Status, NameCell, type Column } from '@/components/ds/DataTable';
import { BILLS, BILL_SUMMARY, BILL_TABS, AP_EMAIL, type Bill } from '@/lib/mock/bills';
import p from '@/components/ds/Page.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<Bill>[] = [
  { key: 'dueDate', header: 'Due date', sortValue: (r) => r.dueDate, muted: true },
  { key: 'status', header: 'Status', sortValue: (r) => r.status, cell: (r) => <Status value={r.status} /> },
  { key: 'recipient', header: 'Recipient', sortValue: (r) => r.recipient, cell: (r) => <NameCell name={r.recipient} /> },
  { key: 'amount', header: 'Amount', numeric: true, sortValue: (r) => r.amount ?? 0, cell: (r) => <Money value={r.amount} /> },
  { key: 'invoiceNo', header: 'Invoice no.', muted: true },
  { key: 'lastUpdated', header: 'Last updated', muted: true },
  {
    key: 'action',
    numeric: true,
    cell: () => <button className={p.btn} type="button">Review</button>,
  },
];

/** Bill Pay and Payments render the same view in the reference interface. */
export function BillsView({ title }: { title: string }) {
  const tr = useT();
  const tabs = useTabs(BILL_TABS);

  return (
    <Page
      title={title}
      actions={[
        { label: tr('Upload bill'), icon: 'file-arrow-up' },
        { label: tr('Send money'), icon: 'paper-plane', primary: true },
      ]}
    >
      <StatTiles
        tiles={[
          {
            label: tr('Total outstanding'),
            value: BILL_SUMMARY.outstanding,
            meta: <Money value={BILL_SUMMARY.outstandingAmount} />,
          },
          {
            label: tr('Overdue'),
            value: BILL_SUMMARY.overdue,
            meta: <Money value={BILL_SUMMARY.overdueAmount} />,
          },
          {
            label: tr('Due in next 7 days'),
            value: BILL_SUMMARY.dueSoon,
            meta: <Money value={BILL_SUMMARY.dueSoonAmount} />,
          },
        ]}
      />

      {tabs.node}

      <DataTable
        rows={BILLS}
        columns={columns}
        searchable
        searchKeys={(r) => `${r.recipient} ${r.invoiceNo} ${r.status}`}
        countLabel={(n) => `${n} draft ${n === 1 ? 'bill' : 'bills'}`}
        emptyMessage="No bills in this view."
      />
    </Page>
  );
}
