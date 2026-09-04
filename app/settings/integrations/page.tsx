'use client';

import { Page, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import {
  CONNECTED_INTEGRATIONS, AVAILABLE_INTEGRATIONS, type Integration,
} from '@/lib/mock/settingsData';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';

function Row({ item, action }: { item: Integration; action: React.ReactNode }) {
  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span
          style={{
            width: 34, height: 34, flex: '0 0 34px', display: 'grid', placeItems: 'center',
            borderRadius: 'var(--ds-border-radius-medium)',
            background: 'var(--ds-background-secondary)', color: 'var(--ds-icon-default)',
          }}
        >
          <Icon name="grid-2" size={16} />
        </span>
        <span style={{ flex: '1 1 180px', minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 16, color: 'var(--ds-text-emphasized)' }}>
            {item.name}
          </span>
          <span className={t.mutedWrap} style={{ fontSize: 13 }}>{item.description}</span>
        </span>
        {action}
      </div>
    </Card>
  );
}

export default function IntegrationsPage() {
  return (
    <Page title="Integrations">
      <SectionTitle>Connected</SectionTitle>
      <div style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
        {CONNECTED_INTEGRATIONS.map((i) => (
          <Row
            key={i.name}
            item={i}
            action={<span className={`${t.status} ${t.statusOk}`}>{i.status}</span>}
          />
        ))}
      </div>

      <SectionTitle>Available</SectionTitle>
      <div style={{ display: 'grid', gap: 12 }}>
        {AVAILABLE_INTEGRATIONS.map((i) => (
          <Row
            key={i.name}
            item={i}
            action={
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`${t.status} ${t.statusNeutral}`}>{i.category}</span>
                <button className={p.btn} type="button">Connect</button>
              </span>
            }
          />
        ))}
      </div>
    </Page>
  );
}
