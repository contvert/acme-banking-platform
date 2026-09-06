'use client';

import { Page, SectionTitle, Money } from '@/components/ds/Page';
import { DataTable, Status, type Column } from '@/components/ds/DataTable';
import { CHECKS, type Check } from '@/lib/mock/checks';
import { useT } from '@/components/i18n/I18nProvider';

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
  const tr = useT();
  return (
    <Page
      title={tr('Checkbooks')}
      actions={[
        { label: tr('Settings'), icon: 'gear', href: '/checkbooks/settings' },
        { label: tr('Order Checkbook'), icon: 'money-check', primary: true, href: '/checkbooks/settings' },
      ]}
    >
      <SectionTitle>{tr('Checks needing review')}</SectionTitle>
      <DataTable
        rows={CHECKS}
        columns={columns}
        countLabel={(n) => `${n} ${n === 1 ? 'check' : 'checks'}`}
      />
    </Page>
  );
}
