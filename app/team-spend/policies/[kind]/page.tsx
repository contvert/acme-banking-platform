'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Page, Tabs, SectionTitle, Money } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { POLICIES } from '@/lib/mock/policies';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const KINDS = [
  { slug: 'card-spend', label: 'Card spend' },
  { slug: 'reimbursements', label: 'Reimbursements' },
];

export default function PolicyKindPage({ params }: { params: Promise<{ kind: string }> }) {
  const tr = useT();
  const { kind } = use(params);
  const router = useRouter();
  const current = KINDS.find((k) => k.slug === kind);
  if (!current) notFound();

  return (
    <Page title={tr('Spend Policies')}>
      <Tabs
        tabs={KINDS.map((k) => ({ label: k.label }))}
        active={current.label}
        onChange={(label) => {
          const next = KINDS.find((k) => k.label === label);
          if (next) router.push(`/team-spend/policies/${next.slug}`);
        }}
      />
      <SectionTitle>{current.label} requirements</SectionTitle>
      <div style={{ display: 'grid', gap: 16 }}>
        {POLICIES.map((policy) => (
          <Card key={policy.title}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, color: 'var(--ds-text-emphasized)', marginBottom: 4 }}>
                  {policy.title}
                </div>
                <div style={{ fontSize: 15, color: 'var(--ds-text-secondary)' }}>
                  {policy.rule} <Money value={policy.threshold} noCents />
                </div>
                {policy.excluded.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span className={t.muted} style={{ fontSize: 13 }}>{tr('Excluded merchants:')}</span>
                    {policy.excluded.map((m) => (
                      <span key={m} className={`${t.status} ${t.statusNeutral}`}>{m}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={p.btn} type="button">{tr('Disable')}</button>
                <button className={p.btn} type="button">{tr('Edit')}</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
