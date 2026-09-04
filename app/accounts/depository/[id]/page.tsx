'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Page, StatTiles, SectionTitle } from '@/components/ds/Page';
import { useConfig } from '@/components/config/ConfigProvider';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';

/**
 * Accounts are addressed by their config id. Legacy `party-bankidN` links
 * still resolve, by position, so bookmarks written before the store existed
 * do not dead-end.
 */
function resolve(id: string, accounts: { id: string }[]) {
  const direct = accounts.findIndex((a) => a.id === id);
  if (direct >= 0) return direct;

  const legacy = id.match(/^party-bankid(\d+)$/);
  if (legacy) {
    const i = Number(legacy[1]);
    if (i < accounts.length) return i;
    return accounts.length ? 0 : -1;
  }
  return -1;
}

export default function DepositoryAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { config, money } = useConfig();

  const index = resolve(id, config.accounts);
  if (index < 0) notFound();
  const account = config.accounts[index];

  return (
    <Page
      title={account.name}
      actions={[
        { label: 'Relevés', icon: 'file-lines', href: '/settings/documents/statements' },
        { label: 'Virement', icon: 'arrow-right-arrow-left', primary: true, href: '/send-money/transfer' },
      ]}
    >
      <StatTiles
        tiles={[
          { label: 'Solde', value: money(account.balance, account.currency) },
          { label: 'Disponible', value: money(account.available, account.currency) },
          {
            label: 'En attente',
            value: money(account.pending, account.currency),
            meta: account.pending ? 'Autorisé, pas encore débité' : undefined,
          },
          {
            label: 'Compte',
            value: account.last4 ? `••${account.last4}` : '—',
            meta: `${account.kind} · ${account.status}`,
          },
        ]}
      />
      <SectionTitle>Transactions</SectionTitle>
      <TransactionsTable showViews={false} showToolbar />
    </Page>
  );
}
