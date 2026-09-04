'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { useCompany } from '@/lib/config/adapters';
import p from '@/components/ds/Page.module.css';

export default function CompanyProfilePage() {
  const company = useCompany();
  const FIELDS: { label: string; value: string; hint?: string }[] = [
    { label: 'Nom commercial', value: company.name, hint: 'Apparaît dans le produit et dans vos notifications.' },
    { label: 'Raison sociale', value: company.legalName },
    { label: 'Accroche', value: company.tagline },
    { label: 'E-mail', value: company.email },
    { label: 'Téléphone', value: company.phone },
    { label: 'Adresse', value: company.address.join(', ') },
  ];
  return (
    <Page title="Company profile">
      <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        {FIELDS.map((f) => (
          <Card key={f.label} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--ds-text-tertiary)', marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 16, color: 'var(--ds-text-emphasized)' }}>{f.value}</div>
                {f.hint && <div style={{ fontSize: 13, color: 'var(--ds-text-tertiary)', marginTop: 4 }}>{f.hint}</div>}
              </div>
              <button className={p.btn} type="button">Edit</button>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
