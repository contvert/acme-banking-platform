'use client';

import { Page, StatTiles, SectionTitle, Money } from '@/components/ds/Page';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { CREDIT } from '@/lib/mock/dashboard';

export default function CreditAccountPage() {
  return (
    <Page
      title="Credit Card"
      actions={[
        { label: 'Edit autopay', icon: 'repeat', href: '/send-money/transfer' },
        { label: 'Pay', icon: 'paper-plane', primary: true, href: '/send-money/transfer' },
      ]}
    >
      <StatTiles
        tiles={[
          { label: 'Balance', value: <Money value={CREDIT.balance} /> },
          { label: 'Available', value: <Money value={CREDIT.available} noCents /> },
          { label: 'Limit', value: <Money value={CREDIT.limit} noCents /> },
          { label: 'Autopay', value: CREDIT.autopayDate, meta: 'Next scheduled payment' },
        ]}
      />
      <SectionTitle>Transactions</SectionTitle>
      <TransactionsTable showViews={false} showToolbar />
    </Page>
  );
}
