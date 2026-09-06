'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function AddAuthorizationPage() {
  const tr = useT();
  return (
    <Page title={tr('Add ACH authorization')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="vendor">{tr('Vendor')}</label>
        <input id="vendor" className={f.select} placeholder={tr('Company name')} />
        <label className={f.label} htmlFor="account">{tr('Account')}</label>
        <select id="account" className={f.select}>
          <option>Ops / Payroll</option>
          <option>AP</option>
          <option>AR</option>
          <option>{tr('Checking')}</option>
        </select>
        <label className={f.label} htmlFor="transaction-limit">{tr('Transaction limit')}</label>
        <input id="transaction-limit" className={f.select} placeholder={tr('$0.00 or leave blank for none')} />

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Authorize')}</button>
        </div>
      </Card>
    </Page>
  );
}
