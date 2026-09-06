'use client';

import { Page, useTabs, Money } from '@/components/ds/Page';
import { DataTable, NameCell, type Column } from '@/components/ds/DataTable';
import { ACH_AUTHS, ACH_FLAGGED, type AchAuth } from '@/lib/mock/payments';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<AchAuth>[] = [
  { key: 'vendor', header: 'Vendor', sortValue: (r) => r.vendor, cell: (r) => <NameCell name={r.vendor} /> },
  { key: 'authorizedOn', header: 'Authorized on', muted: true },
  { key: 'account', header: 'Authorized for', muted: true },
  {
    key: 'limit', header: 'Transaction limit', numeric: true,
    sortValue: (r) => r.limit ?? 0,
    cell: (r) => (r.limit == null ? <span>None</span> : <Money value={r.limit} />),
  },
];

export default function AuthorizationsPage() {
  const tr = useT();
  const tabs = useTabs([
    { label: tr('All'), count: ACH_AUTHS.length },
    { label: tr('Flagged'), count: ACH_FLAGGED },
  ]);

  return (
    <Page title={tr('ACH Authorizations')} actions={[{ label: tr('Add ACH authorization'), icon: 'plus', primary: true, href: '/payments/authorizations/add' }]}>
      {tabs.node}
      <DataTable rows={ACH_AUTHS} columns={columns} countLabel={(n) => `${n} authorizations`} />
    </Page>
  );
}
