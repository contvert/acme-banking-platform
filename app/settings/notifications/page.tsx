'use client';

import { Page, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { NOTIFICATION_GROUPS } from '@/lib/mock/settingsData';
import t from '@/components/dashboard/TransactionsTable.module.css';

function Channel({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      className={`${t.status} ${on ? t.statusOk : t.statusNeutral}`}
      style={{ marginLeft: 0 }}
    >
      {on && <Icon name="check" size={10} />} {label}
    </span>
  );
}

export default function NotificationsPage() {
  return (
    <Page title="Notifications">
      {NOTIFICATION_GROUPS.map((g) => (
        <div key={g.title}>
          <SectionTitle>{g.title}</SectionTitle>
          <div style={{ display: 'grid', gap: 12 }}>
            {g.items.map((i) => (
              <Card key={i.name} style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 16, color: 'var(--ds-text-emphasized)' }}>
                      {i.name}
                    </span>
                    <span className={t.mutedWrap} style={{ fontSize: 13 }}>{i.description}</span>
                  </span>
                  <span style={{ display: 'flex', gap: 8 }}>
                    <Channel label="Email" on={i.email} />
                    <Channel label="Push" on={i.push} />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </Page>
  );
}
