'use client';

import { Page, SectionTitle, Money } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { CHECKBOOKS, CHECK_REVIEW, CHECK_ACCOUNTS, type Checkbook } from '@/lib/mock/checkbookSettings';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<Checkbook>[] = [
  { key: 'ordered', header: 'Order date', muted: true, sortValue: (r) => r.ordered },
  { key: 'nickname', header: 'Nickname', sortValue: (r) => r.nickname },
  { key: 'account', header: 'Account', muted: true },
  { key: 'range', header: 'Range', muted: true },
];

export default function CheckbookSettingsPage() {
  const translate = useT();
  return (
    <Page title={translate('Checkbook Settings')} actions={[{ label: translate('Order Checkbook'), icon: 'money-check', primary: true, href: '/checkbooks/settings' }]}>
      <SectionTitle>{translate('Enabled accounts')}</SectionTitle>
      <p style={{ fontSize: 15, color: 'var(--ds-text-secondary)', marginTop: 0 }}>{translate('Enabling an account lets you order checkbooks for it, including from third-party providers.')}</p>
      <Card style={{ maxWidth: 700, marginBottom: 24 }}>
        {CHECK_ACCOUNTS.map((a, i) => (
          <div key={a.name} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--ds-border-default)',
          }}>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 16 }}>{a.name}</span>
              <span className={t.muted} style={{ fontSize: 13 }}>{a.detail}</span>
            </span>
            <Money value={a.balance} />
          </div>
        ))}
      </Card>

      <SectionTitle>{translate('Check review settings')}</SectionTitle>
      <Card style={{ maxWidth: 700, marginBottom: 24 }}>
        <p style={{ marginTop: 0, fontSize: 15, color: 'var(--ds-text-secondary)', lineHeight: 1.5 }}>
          {CHECK_REVIEW.note}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ flex: 1, fontSize: 16 }}>{translate('Default review action')}</span>
          <span className={`${t.status} ${t.statusOk}`}>{CHECK_REVIEW.defaultAction}</span>
          <button className={p.btn} type="button">{translate('Edit')}</button>
        </div>
      </Card>

      <SectionTitle>{translate('Ordered checkbooks')}</SectionTitle>
      <DataTable rows={CHECKBOOKS} columns={columns} countLabel={(n) => `${n} checkbooks`} />
    </Page>
  );
}
