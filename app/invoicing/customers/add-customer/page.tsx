'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function AddCustomerPage() {
  const tr = useT();
  return (
    <Page title={tr('Add customer')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="customer-name">{tr('Customer name')}</label>
        <input id="customer-name" className={f.select} placeholder={tr('Company or person')} />
        <label className={f.label} htmlFor="email">{tr('Email')}</label>
        <input id="email" className={f.select} placeholder="billing@example.invalid" />
        <label className={f.label} htmlFor="payment-terms">{tr('Payment terms')}</label>
        <select id="payment-terms" className={f.select}>
          <option>{tr('Due on receipt')}</option>
          <option>{tr('Net 15')}</option>
          <option>{tr('Net 30')}</option>
          <option>{tr('Net 60')}</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Save customer')}</button>
        </div>
      </Card>
    </Page>
  );
}
