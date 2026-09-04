'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function DrawdownRecipientPage() {
  return (
    <Page title="Drawdown recipient">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="recipient-name">Recipient name</label>
        <input id="recipient-name" className={f.select} placeholder="Company or person" />
        <label className={f.label} htmlFor="pay-from">Pay from</label>
        <select id="pay-from" className={f.select}>
          <option>Ops / Payroll</option>
          <option>AP</option>
          <option>AR</option>
        </select>
        <label className={f.label} htmlFor="withdrawal-limit">Withdrawal limit</label>
        <input id="withdrawal-limit" className={f.select} placeholder="$0.00 or leave blank for none" />

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Create authorization</button>
        </div>
      </Card>
    </Page>
  );
}
