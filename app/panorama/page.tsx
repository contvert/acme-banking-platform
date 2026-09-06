'use client';

import { Page, Money, MoneyCompact } from '@/components/ds/Page';
import { DataTable, NameCell, type Column } from '@/components/ds/DataTable';
import p from '@/components/ds/Page.module.css';
import { useT } from '@/components/i18n/I18nProvider';

interface OrgAccount {
  org: string;
  balance: number | null;
  movement: number | null;
  action: string;
}

/** The multi-org "All Accounts" view, as captured from /panorama. */
const ORGS: OrgAccount[] = [
  { org: 'Debug, LLC', balance: 2_023_267.12, movement: 35_300_000, action: 'Open Banking' },
  { org: 'Mercury', balance: 4_944_707.08, movement: 86_300_000, action: 'Open Banking' },
  { org: 'Nano Tech', balance: 226_767.82, movement: 4_000_000, action: 'Open Banking' },
  { org: 'Tax Bureau, Inc.', balance: 0, movement: 0, action: 'Open Banking' },
  { org: 'CompConsult', balance: null, movement: null, action: '2FA Reset' },
  { org: 'Pico Accountants', balance: null, movement: null, action: 'Advisor Portal' },
];

const columns: Column<OrgAccount>[] = [
  { key: 'org', header: 'Account', sortValue: (r) => r.org, cell: (r) => <NameCell name={r.org} /> },
  {
    key: 'balance', header: 'Balance', numeric: true,
    sortValue: (r) => r.balance ?? -1,
    cell: (r) => <Money value={r.balance} />,
  },
  {
    key: 'movement', header: 'Money movement', numeric: true,
    sortValue: (r) => r.movement ?? -1,
    cell: (r) => (r.movement == null ? <span>—</span> : <MoneyCompact value={r.movement} />),
  },
  {
    key: 'action', numeric: true,
    cell: (r) => <button className={p.btn} type="button">{r.action}</button>,
  },
];

export default function PanoramaPage() {
  const tr = useT();
  return (
    <Page
      title={tr('All Accounts')}
      actions={[
        { label: tr('Set as default view'), icon: 'star' },
        { label: tr('Download statements'), icon: 'arrow-down-to-line', href: '/settings/documents/statements' },
      ]}
    >
      <DataTable
        rows={ORGS}
        columns={columns}
        searchable
        searchKeys={(r) => r.org}
        countLabel={(n) => `${n} accounts`}
      />
    </Page>
  );
}
