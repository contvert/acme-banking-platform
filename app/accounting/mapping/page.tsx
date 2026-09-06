'use client';

import { Page, useTabs, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { CATEGORIES } from '@/lib/mock/settingsExtras';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function AccountingMappingPage() {
  const translate = useT();
  const tabs = useTabs([
    { label: translate('GL codes') },
    { label: translate('Categorization rules') },
    { label: translate('Automation settings') },
  ]);

  return (
    <Page title={translate('Accounting Settings')} actions={[{ label: translate('Upload GL codes'), icon: 'file-arrow-up', primary: true }]}>
      {tabs.node}
      {tabs.active === 'GL codes' && (
        <>
          <SectionTitle>{translate('Your uploaded GL codes')}</SectionTitle>
          <Card style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16 }}>{translate('GL code list')}</div>
                <div className={t.muted} style={{ fontSize: 13 }}>Uploaded 08:37 PM GMT+2, Sep 3, 2026</div>
              </div>
              <button className={p.btn} type="button">{translate('Edit')}</button>
            </div>
          </Card>
        </>
      )}
      {tabs.active === 'Categorization rules' && (
        <>
          <SectionTitle>{translate('Categories in use')}</SectionTitle>
          <Card style={{ maxWidth: 700 }}>
            {CATEGORIES.map((c, i) => (
              <div key={c} style={{
                display: 'flex', alignItems: 'center', padding: '10px 0', fontSize: 16,
                borderTop: i === 0 ? 'none' : '1px solid var(--ds-border-default)',
              }}>{c}</div>
            ))}
          </Card>
        </>
      )}
      {tabs.active === 'Automation settings' && (
        <Card style={{ maxWidth: 700 }}>
          <div style={{ fontSize: 16, marginBottom: 6 }}>{translate('Auto-categorise new transactions')}</div>
          <div className={t.muted} style={{ fontSize: 15 }}>{translate('Applies your saved rules as transactions arrive, before export.')}</div>
        </Card>
      )}
    </Page>
  );
}
