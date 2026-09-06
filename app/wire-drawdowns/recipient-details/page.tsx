'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function DrawdownRecipientPage() {
  const tr = useT();
  return (
    <Page title={tr('Drawdown recipient')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="recipient-name">{tr('Recipient name')}</label>
        <input id="recipient-name" className={f.select} placeholder={tr('Company or person')} />
        <label className={f.label} htmlFor="pay-from">{tr('Pay from')}</label>
        <select id="pay-from" className={f.select}>
          <option>Ops / Payroll</option>
          <option>AP</option>
          <option>AR</option>
        </select>
        <label className={f.label} htmlFor="withdrawal-limit">{tr('Withdrawal limit')}</label>
        <input id="withdrawal-limit" className={f.select} placeholder={tr('$0.00 or leave blank for none')} />

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Create authorization')}</button>
        </div>
      </Card>
    </Page>
  );
}
