'use client';

import { use } from 'react';
import Link from 'next/link';
import { Page, SectionTitle, Money } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { TRANSACTIONS } from '@/lib/mock/transactions';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

/** Transaction ids in the reference are opaque; index into the ledger deterministically. */
function pick(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return TRANSACTIONS[h % TRANSACTIONS.length];
}

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const translate = useT();
  const { id } = use(params);
  const tx = pick(id);

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: translate('Amount'), value: <Money value={tx.amount} tone={(tx.amount ?? 0) > 0 ? 'green' : 'default'} /> },
    { label: translate('Date'), value: tx.date },
    { label: translate('To / From'), value: tx.party },
    { label: translate('Account'), value: tx.account },
    { label: translate('Method'), value: tx.method },
    { label: translate('Status'), value: tx.status ? <span className={`${t.status} ${t.statusFailed}`}>{tx.status}</span> : 'Completed' },
    { label: translate('Reference'), value: id },
  ];

  return (
    <Page
      title={tx.party}
      actions={[
        { label: translate('Add note'), icon: 'note' },
        { label: translate('Download receipt'), icon: 'arrow-down-to-line' },
      ]}
    >
      <Link href="/transactions" className={p.btn} style={{ marginBottom: 20 }}>
        <Icon name="chevron-left" size={12} />{translate('All transactions')}</Link>

      <SectionTitle>{translate('Details')}</SectionTitle>
      <Card style={{ maxWidth: 640 }}>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--ds-border-default)',
            }}
          >
            <span style={{ flex: 1, fontSize: 15, color: 'var(--ds-text-secondary)' }}>{r.label}</span>
            <span style={{ fontSize: 16, color: 'var(--ds-text-emphasized)' }}>{r.value}</span>
          </div>
        ))}
      </Card>
    </Page>
  );
}
