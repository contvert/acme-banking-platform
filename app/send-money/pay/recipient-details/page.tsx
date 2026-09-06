'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function RecipientDetailsPage() {
  const tr = useT();
  return (
    <Page title={tr('Recipient details')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="recipient-name">{tr('Recipient name')}</label>
        <input id="recipient-name" className={f.select} placeholder={tr('Company or person')} />
        <label className={f.label} htmlFor="routing-number">{tr('Routing number')}</label>
        <input id="routing-number" className={f.select} placeholder={tr('9 digits')} />
        <label className={f.label} htmlFor="account-number">{tr('Account number')}</label>
        <input id="account-number" className={f.select} placeholder={tr('Account number')} />
        <label className={f.label} htmlFor="payment-method">{tr('Payment method')}</label>
        <select id="payment-method" className={f.select}>
          <option>{tr('ACH')}</option>
          <option>{tr('Domestic Wire')}</option>
          <option>{tr('International Wire')}</option>
          <option>{tr('Check')}</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Continue')}</button>
        </div>
      </Card>
    </Page>
  );
}
