'use client';

import { Page, StatTiles, SectionTitle, Money } from '@/components/ds/Page';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { CREDIT } from '@/lib/mock/dashboard';
import { useT } from '@/components/i18n/I18nProvider';

export default function CreditAccountPage() {
  const tr = useT();
  return (
    <Page
      title={tr('Credit Card')}
      actions={[
        { label: tr('Edit autopay'), icon: 'repeat', href: '/send-money/transfer' },
        { label: tr('Pay'), icon: 'paper-plane', primary: true, href: '/send-money/transfer' },
      ]}
    >
      <StatTiles
        tiles={[
          { label: tr('Balance'), value: <Money value={CREDIT.balance} /> },
          { label: tr('Available'), value: <Money value={CREDIT.available} noCents /> },
          { label: tr('Limit'), value: <Money value={CREDIT.limit} noCents /> },
          { label: tr('Autopay'), value: CREDIT.autopayDate, meta: 'Next scheduled payment' },
        ]}
      />
      <SectionTitle>{tr('Transactions')}</SectionTitle>
      <TransactionsTable showViews={false} showToolbar />
    </Page>
  );
}
