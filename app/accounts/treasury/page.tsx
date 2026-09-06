'use client';

import { Page, StatTiles, SectionTitle, Money } from '@/components/ds/Page';
import { useAccounts } from '@/lib/config/adapters';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { useT } from '@/components/i18n/I18nProvider';

export default function TreasuryPage() {
  const tr = useT();
  const ACCOUNTS = useAccounts();
  const treasury = ACCOUNTS.find((a) => a.kind === 'treasury');

  return (
    <Page title={tr('Treasury')} actions={[{ label: tr('Manage'), icon: 'gear', href: '/accounts/treasury/party-treasury-id-0/portfolio/edit' }]}>
      <StatTiles
        tiles={[
          { label: tr('Balance'), value: <Money value={treasury?.balance ?? 0} /> },
          { label: tr('Yield'), value: '4.15%', meta: 'Annualised, net of fees' },
        ]}
      />
      <SectionTitle>{tr('Activity')}</SectionTitle>
      <TransactionsTable showViews={false} showToolbar />
    </Page>
  );
}
