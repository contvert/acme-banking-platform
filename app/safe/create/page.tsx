'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function CreateSafePage() {
  const tr = useT();
  return (
    <Page title={tr('Create a SAFE')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="investor">{tr('Investor name')}</label>
        <input id="investor" className={f.select} placeholder={tr('Investor or fund')} />
        <label className={f.label} htmlFor="amount">{tr('Investment amount')}</label>
        <input id="amount" className={f.select} placeholder="$0.00" />
        <label className={f.label} htmlFor="type">{tr('SAFE type')}</label>
        <select id="type" className={f.select}>
          <option>{tr('Valuation cap, no discount')}</option>
          <option>{tr('Discount, no valuation cap')}</option>
          <option>{tr('Valuation cap and discount')}</option>
          <option>{tr('MFN, no cap or discount')}</option>
        </select>
        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Create SAFE')}</button>
        </div>
      </Card>
    </Page>
  );
}
