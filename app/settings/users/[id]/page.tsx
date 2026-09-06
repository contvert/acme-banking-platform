'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Page, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { Status } from '@/components/ds/DataTable';
import { TEAM } from '@/lib/mock/team';
import { CARDS } from '@/lib/mock/cards';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const translate = useT();
  const { id } = use(params);
  const index = Number(id.replace(/\D/g, ''));
  const member = TEAM[Number.isFinite(index) ? index % TEAM.length : 0];
  if (!member) notFound();

  const cards = CARDS.filter((c) => c.holder === member.name);
  const initials = member.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('');

  const fields = [
    { label: translate('Email'), value: member.email },
    { label: translate('Role'), value: member.role },
    { label: translate('Job title'), value: member.title ?? '—' },
    { label: translate('Department'), value: member.department ?? '—' },
  ];

  return (
    <Page title={member.name} actions={[{ label: translate('Edit access'), icon: 'shield-check', primary: true, href: '/settings/roles' }]}>
      <Link href="/settings/users" className={p.btn} style={{ marginBottom: 20 }}>
        <Icon name="chevron-left" size={12} />{translate('Team')}</Link>

      <Card style={{ maxWidth: 700, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            width: 48, height: 48, flex: '0 0 48px', display: 'grid', placeItems: 'center',
            borderRadius: '50%', background: 'var(--ds-background-secondary)',
            color: 'var(--ds-text-secondary)', fontSize: 18,
          }}>{initials}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, color: 'var(--ds-text-title)' }}>{member.name}</div>
            <div className={t.muted} style={{ fontSize: 15 }}>{member.email}</div>
          </div>
          <Status value={member.status} />
        </div>
      </Card>

      <SectionTitle>{translate('Access')}</SectionTitle>
      <Card style={{ maxWidth: 700, marginBottom: 24 }}>
        {fields.map((f, i) => (
          <div key={f.label} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--ds-border-default)',
          }}>
            <span style={{ flex: 1, fontSize: 15, color: 'var(--ds-text-secondary)' }}>{f.label}</span>
            <span style={{ fontSize: 16 }}>{f.value}</span>
          </div>
        ))}
      </Card>

      <SectionTitle>{translate('Cards')}</SectionTitle>
      {cards.length ? (
        <Card style={{ maxWidth: 700 }}>
          {cards.map((c, i) => (
            <div key={c.last4} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--ds-border-default)',
            }}>
              <Icon name="credit-card" size={15} />
              <span style={{ flex: 1, fontSize: 16 }}>••{c.last4} {c.label ?? ''}</span>
              <Status value={c.status === 'suspended' ? 'Suspended' : 'Active'} />
            </div>
          ))}
        </Card>
      ) : (
        <Card style={{ maxWidth: 700 }}>
          <span className={t.muted} style={{ fontSize: 15 }}>{translate('No cards issued to this member.')}</span>
        </Card>
      )}
    </Page>
  );
}
