'use client';

import { Page, SectionTitle, Money } from '@/components/ds/Page';
import { useAccounts } from '@/lib/config/adapters';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';

const ALLOCATIONS = [
  { name: 'US Treasury bills', pct: 62, yield: 4.21 },
  { name: 'Government money market', pct: 28, yield: 4.05 },
  { name: 'Cash sweep', pct: 10, yield: 3.60 },
];

export default function PortfolioEditPage() {
  const ACCOUNTS = useAccounts();
  const treasury = ACCOUNTS.find((a) => a.kind === 'treasury');
  return (
    <Page title="Edit portfolio" actions={[{ label: 'Save changes', icon: 'check', primary: true }]}>
      <Card style={{ maxWidth: 640, marginBottom: 24 }}>
        <div className={p.tileLabel}>Invested balance</div>
        <div className={p.tileValue}><Money value={treasury?.balance ?? 0} /></div>
      </Card>
      <SectionTitle>Allocation</SectionTitle>
      <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        {ALLOCATIONS.map((a) => (
          <Card key={a.name} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ flex: 1, fontSize: 16 }}>{a.name}</span>
              <span style={{ fontSize: 15, color: 'var(--ds-text-secondary)' }}>{a.yield}% yield</span>
              <span style={{ fontSize: 16, minWidth: 48, textAlign: 'right' }}>{a.pct}%</span>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
