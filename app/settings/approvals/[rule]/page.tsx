'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Page, Tabs } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { APPROVAL_RULES } from '@/lib/mock/settingsData';
import p from '@/components/ds/Page.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const RULES = [
  { slug: 'paymentApprovals', label: 'Per-payment' },
  { slug: 'dailyMaximum', label: 'Daily maximum' },
  { slug: 'dualAdmin', label: 'Dual admin' },
];

export default function ApprovalRulePage({ params }: { params: Promise<{ rule: string }> }) {
  const t = useT();
  const { rule } = use(params);
  const router = useRouter();
  const current = RULES.find((r) => r.slug === rule);
  if (!current) notFound();

  const detail = APPROVAL_RULES.find((r) => r.scope === current.label);

  return (
    <Page title={t('Approval Rules')} actions={[{ label: t('Add rule'), icon: 'plus', primary: true }]}>
      <Tabs
        tabs={RULES.map((r) => ({ label: r.label }))}
        active={current.label}
        onChange={(label) => {
          const next = RULES.find((r) => r.label === label);
          if (next) router.push(`/settings/approvals/${next.slug}`);
        }}
      />
      <p style={{ fontSize: 15, color: 'var(--ds-text-secondary)', marginTop: 0 }}>{t('Separation of duties prevents a payment requester from approving their own payment.')}</p>
      <Card style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, color: 'var(--ds-text-emphasized)', marginBottom: 4 }}>
              {current.label}
            </div>
            <div style={{ fontSize: 15, color: 'var(--ds-text-secondary)' }}>
              {detail?.rule ?? 'No condition configured.'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ds-text-tertiary)', marginTop: 4 }}>
              Require approval from {detail?.approver ?? 'any admin'}
            </div>
          </div>
          <button className={p.btn} type="button">{t('Edit')}</button>
        </div>
      </Card>
    </Page>
  );
}
