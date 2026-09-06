'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { useCompany } from '@/lib/config/adapters';
import p from '@/components/ds/Page.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function CompanyProfilePage() {
  const tr = useT();
  const company = useCompany();
  const FIELDS: { label: string; value: string; hint?: string }[] = [
    { label: tr('Trade name'), value: company.name, hint: tr('Appears in the product and in your notifications.') },
    { label: tr('Legal name'), value: company.legalName },
    { label: tr('Tagline'), value: company.tagline },
    { label: tr('Email'), value: company.email },
    { label: tr('Phone'), value: company.phone },
    { label: tr('Address'), value: company.address.join(', ') },
  ];
  return (
    <Page title={tr('Company profile')}>
      <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        {FIELDS.map((f) => (
          <Card key={f.label} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--ds-text-tertiary)', marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 16, color: 'var(--ds-text-emphasized)' }}>{f.value}</div>
                {f.hint && <div style={{ fontSize: 13, color: 'var(--ds-text-tertiary)', marginTop: 4 }}>{f.hint}</div>}
              </div>
              <button className={p.btn} type="button">{tr('Edit')}</button>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
