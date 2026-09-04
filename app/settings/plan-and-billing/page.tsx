'use client';

import { Page, StatTiles, SectionTitle, Money } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { PLAN } from '@/lib/mock/settingsData';
import { BRAND } from '@/lib/brand';

export default function PlanPage() {
  return (
    <Page title="Plan & Billing" actions={[{ label: 'Manage', icon: 'gear', primary: true }]}>
      <StatTiles
        tiles={[
          { label: 'Your plan', value: `${BRAND.name} ${PLAN.name}` },
          { label: 'Pricing', value: <><Money value={PLAN.price} noCents />/mo</> },
        ]}
      />
      <SectionTitle>Included with {BRAND.name} {PLAN.name}</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {PLAN.groups.map((g) => (
          <Card key={g.title}>
            <div style={{ fontSize: 16, color: 'var(--ds-text-emphasized)', marginBottom: 10 }}>{g.title}</div>
            {g.features.map((f) => (
              <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '5px 0', fontSize: 15 }}>
                <Icon name="circle-check" size={14} />
                {f}
              </div>
            ))}
          </Card>
        ))}
      </div>
    </Page>
  );
}
