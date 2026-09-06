'use client';

import { Page, useTabs, Money, Note } from '@/components/ds/Page';
import { useTransactions } from '@/lib/config/adapters';
import { DataTable, NameCell, type Column } from '@/components/ds/DataTable';
import type {Transaction} from '@/lib/mock/transactions';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

/** Accounting reuses the transaction ledger with bookkeeping columns bolted on. */
const columns: Column<Transaction>[] = [
  { key: 'date', header: 'Date (GMT+2)', sortValue: (r) => r.date, muted: true },
  { key: 'party', header: 'To/From', sortValue: (r) => r.party, cell: (r) => <NameCell name={r.party} /> },
  {
    key: 'amount', header: 'Amount', numeric: true,
    sortValue: (r) => r.amount ?? 0,
    cell: (r) => <Money value={r.amount} tone={(r.amount ?? 0) > 0 ? 'green' : 'default'} />,
  },
  { key: 'method', header: 'Payment Method', muted: true },
  { key: 'category', header: 'Category', cell: () => <span className={t.muted}>Category</span> },
  { key: 'gl', header: 'GL Code', cell: () => <span className={t.muted}>GL Code</span> },
  { key: 'receipt', header: 'Receipt', cell: () => <span className={t.muted}>—</span> },
];

export default function AccountingPage() {
  const translate = useT();
  const TRANSACTIONS = useTransactions();
  const tabs = useTabs([
    { label: translate('All'), count: TRANSACTIONS.length },
    { label: translate('Needs review') },
    { label: translate('Ready to Export') },
    { label: translate('Sync Error'), count: 3 },
    { label: translate('Exported') },
  ]);

  const rows = tabs.active === 'All' ? TRANSACTIONS : TRANSACTIONS.slice(0, 3);

  return (
    <Page
      title={translate('Accounting')}
      actions={[
        { label: translate('Settings'), icon: 'gear', href: '/accounting/mapping' },
        { label: translate('Export'), icon: 'arrow-down-to-line', primary: true },
      ]}
    >
      <Note>{translate('Your sync is almost complete. Check the')}<strong>{translate('Sync Error')}</strong> tab to review items
        that need attention.
      </Note>

      {tabs.node}

      <DataTable
        rows={rows}
        columns={columns}
        searchable
        searchKeys={(r) => `${r.party} ${r.method} ${r.account}`}
        countLabel={(n) => `${n} ${n === 1 ? 'transaction' : 'transactions'}`}
      />
    </Page>
  );
}
