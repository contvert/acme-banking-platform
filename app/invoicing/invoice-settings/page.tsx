'use client';

import { Page, useTabs, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { BRAND } from '@/lib/brand';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const TOGGLES = [
  'Send receipts to customers',
  'Show service periods on invoices',
  'Show federal tax ID / EIN on invoice',
];

export default function InvoiceSettingsPage() {
  const translate = useT();
  const tabs = useTabs([{ label: translate('General') }, { label: translate('Branding') }, { label: translate('Defaults') }]);

  return (
    <Page title={translate('Invoice settings')} actions={[{ label: translate('Save'), icon: 'check', primary: true }]}>
      {tabs.node}

      {tabs.active === 'General' && (
        <>
          <SectionTitle>{translate('Invoice header')}</SectionTitle>
          <Card style={{ maxWidth: 560, marginBottom: 24 }}>
            <label className={f.label} htmlFor="company">{translate('Company name')}</label>
            <input id="company" className={f.select} defaultValue={BRAND.productName} />
            <label className={f.label} htmlFor="email">{translate('Email')}</label>
            <input id="email" className={f.select} placeholder="billing@example.invalid" />
            <label className={f.label} htmlFor="phone">{translate('Phone number')}</label>
            <input id="phone" className={f.select} placeholder="+1 (800) 000-0000" />
          </Card>

          <SectionTitle>{translate('Integrations')}</SectionTitle>
          <div style={{ display: 'grid', gap: 12, maxWidth: 700 }}>
            <Card style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <Icon name="credit-card" size={16} />
                <span style={{ flex: '1 1 180px', minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 16 }}>{translate('Accept card payments')}</span>
                  <span className={t.mutedWrap} style={{ fontSize: 13 }}>{translate('Connect a processor to enable card payment per invoice.')}</span>
                </span>
                <button className={p.btn} type="button">{translate('Set Up')}</button>
              </div>
            </Card>
            <Card style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <Icon name="terminal" size={16} />
                <span style={{ flex: '1 1 180px', minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 16 }}>{translate('Invoicing API')}</span>
                  <span className={t.mutedWrap} style={{ fontSize: 13 }}>{translate('Access the API and build automations.')}</span>
                </span>
                <button className={p.btn} type="button">{translate('View docs')}</button>
              </div>
            </Card>
          </div>
        </>
      )}

      {tabs.active === 'Branding' && (
        <Card style={{ maxWidth: 560 }}>
          <label className={f.label} htmlFor="logo">{translate('Invoice logo')}</label>
          <input id="logo" className={f.select} type="file" />
          <label className={f.label} htmlFor="accent">{translate('Accent colour')}</label>
          <input id="accent" className={f.select} type="color" defaultValue="#5266eb" />
        </Card>
      )}

      {tabs.active === 'Defaults' && (
        <Card style={{ maxWidth: 700 }}>
          {TOGGLES.map((label, i) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', fontSize: 16,
              borderTop: i === 0 ? 'none' : '1px solid var(--ds-border-default)',
            }}>
              <span style={{ flex: '1 1 180px', minWidth: 0 }}>{label}</span>
              <span className={`${t.status} ${t.statusOk}`}>{translate('On')}</span>
            </div>
          ))}
        </Card>
      )}
    </Page>
  );
}
