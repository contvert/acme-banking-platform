'use client';

import { Page, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';

const ITEMS = [
  { icon: 'key', label: 'Password', value: 'Last changed 4 months ago', action: 'Change' },
  { icon: 'mobile-screen', label: 'Two-factor authentication', value: 'Authenticator app', action: 'Manage', ok: true },
  { icon: 'fingerprint', label: 'Passkeys', value: '1 passkey registered', action: 'Manage', ok: true },
  { icon: 'computer', label: 'Active sessions', value: '2 devices signed in', action: 'Review' },
];

export default function AccountSecurityPage() {
  return (
    <Page title="Account security">
      <SectionTitle>Sign-in</SectionTitle>
      <div style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
        {ITEMS.map((i) => (
          <Card key={i.label} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                width: 34, height: 34, flex: '0 0 34px', display: 'grid', placeItems: 'center',
                borderRadius: 'var(--ds-border-radius-medium)',
                background: 'var(--ds-background-secondary)', color: 'var(--ds-icon-default)',
              }}>
                <Icon name={i.icon} size={16} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: 'var(--ds-text-emphasized)' }}>
                  {i.label}
                  {i.ok && <span className={`${t.status} ${t.statusOk}`}>On</span>}
                </span>
                <span className={t.muted} style={{ fontSize: 13 }}>{i.value}</span>
              </span>
              <button className={p.btn} type="button">{i.action}</button>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
