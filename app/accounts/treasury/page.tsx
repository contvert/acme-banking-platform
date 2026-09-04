'use client';

import { Page, StatTiles, SectionTitle, Money } from '@/components/ds/Page';
import { useAccounts } from '@/lib/config/adapters';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';

export default function TreasuryPage() {
  const ACCOUNTS = useAccounts();
  const treasury = ACCOUNTS.find((a) => a.kind === 'treasury');

  return (
    <Page title="Treasury" actions={[{ label: 'Manage', icon: 'gear', href: '/accounts/treasury/party-treasury-id-0/portfolio/edit' }]}>
      <StatTiles
        tiles={[
          { label: 'Balance', value: <Money value={treasury?.balance ?? 0} /> },
          { label: 'Yield', value: '4.15%', meta: 'Annualised, net of fees' },
        ]}
      />
      <SectionTitle>Activity</SectionTitle>
      <TransactionsTable showViews={false} showToolbar />
    </Page>
  );
}
