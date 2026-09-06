'use client';

import { Page, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { PROFILE_FIELDS, PROFILE_ROLE, LINKED_PROFILES, PROFILE_ACCOUNTS } from '@/lib/mock/profile';
import { USER } from '@/lib/mock/dashboard';
import { BRAND } from '@/lib/brand';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function MyProfilePage() {
  const translate = useT();
  const initials = `${USER.firstName[0]}${USER.lastName[0]}`;

  return (
    <Page title={translate('My profile')}>
      <Card style={{ maxWidth: 760, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              width: 56, height: 56, flex: '0 0 56px', display: 'grid', placeItems: 'center',
              borderRadius: '50%', background: 'var(--ds-background-inverted)',
              color: 'var(--ds-text-on-inverted)', fontSize: 20,
            }}
          >
            {initials}
          </span>
          <div>
            <div style={{ fontSize: 20, color: 'var(--ds-text-title)' }}>
              {USER.firstName} {USER.lastName}
            </div>
            <span className={`${t.status} ${t.statusNeutral}`} style={{ marginLeft: 0 }}>
              {PROFILE_ROLE}
            </span>
          </div>
        </div>
      </Card>

      <SectionTitle>{translate('Personal details')}</SectionTitle>
      <div style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
        {PROFILE_FIELDS.map((f) => (
          <Card key={f.label} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--ds-text-tertiary)', marginBottom: 3 }}>
                  {f.label}
                </div>
                {f.value.length === 0 ? (
                  <div className={t.muted} style={{ fontSize: 16 }}>—</div>
                ) : (
                  f.value.map((line) => (
                    <div key={line} style={{ fontSize: 16, color: 'var(--ds-text-emphasized)' }}>
                      {line}
                    </div>
                  ))
                )}
                {f.hint && (
                  <div style={{ fontSize: 13, color: 'var(--ds-text-tertiary)', marginTop: 4 }}>
                    {f.hint}
                  </div>
                )}
              </div>
              <button className={p.btn} type="button">{f.action}</button>
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle>{BRAND.name} accounts</SectionTitle>
      <p style={{ fontSize: 15, color: 'var(--ds-text-secondary)', marginTop: 0 }}>{translate('Every account directly connected to this profile.')}</p>
      <div style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
        {PROFILE_ACCOUNTS.map((a) => (
          <Card key={a.org} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name="building-columns" size={16} />
              <span style={{ flex: 1, fontSize: 16 }}>{a.org}</span>
              <span className={`${t.status} ${t.statusNeutral}`}>{a.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle>{translate('Linked profiles')}</SectionTitle>
      <p style={{ fontSize: 15, color: 'var(--ds-text-secondary)', marginTop: 0 }}>{translate('Switch between accounts connected to any of these profiles.')}</p>
      <Card style={{ maxWidth: 760 }}>
        {LINKED_PROFILES.map((email, i) => (
          <div
            key={email}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--ds-border-default)',
            }}
          >
            <Icon name="user" size={15} />
            <span style={{ flex: 1, fontSize: 16 }}>{email}</span>
            <button className={p.btn} type="button">{translate('Manage')}</button>
          </div>
        ))}
      </Card>
    </Page>
  );
}
