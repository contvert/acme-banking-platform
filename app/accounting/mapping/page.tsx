'use client';

import { Page, useTabs, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { CATEGORIES } from '@/lib/mock/settingsExtras';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';

export default function AccountingMappingPage() {
  const tabs = useTabs([
    { label: 'GL codes' },
    { label: 'Categorization rules' },
    { label: 'Automation settings' },
  ]);

  return (
    <Page title="Accounting Settings" actions={[{ label: 'Upload GL codes', icon: 'file-arrow-up', primary: true }]}>
      {tabs.node}
      {tabs.active === 'GL codes' && (
        <>
          <SectionTitle>Your uploaded GL codes</SectionTitle>
          <Card style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16 }}>GL code list</div>
                <div className={t.muted} style={{ fontSize: 13 }}>Uploaded 08:37 PM GMT+2, Sep 3, 2026</div>
              </div>
              <button className={p.btn} type="button">Edit</button>
            </div>
          </Card>
        </>
      )}
      {tabs.active === 'Categorization rules' && (
        <>
          <SectionTitle>Categories in use</SectionTitle>
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
          <div style={{ fontSize: 16, marginBottom: 6 }}>Auto-categorise new transactions</div>
          <div className={t.muted} style={{ fontSize: 15 }}>
            Applies your saved rules as transactions arrive, before export.
          </div>
        </Card>
      )}
    </Page>
  );
}
