'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function AddAuthorizationPage() {
  return (
    <Page title="Add ACH authorization">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="vendor">Vendor</label>
        <input id="vendor" className={f.select} placeholder="Company name" />
        <label className={f.label} htmlFor="account">Account</label>
        <select id="account" className={f.select}>
          <option>Ops / Payroll</option>
          <option>AP</option>
          <option>AR</option>
          <option>Checking</option>
        </select>
        <label className={f.label} htmlFor="transaction-limit">Transaction limit</label>
        <input id="transaction-limit" className={f.select} placeholder="$0.00 or leave blank for none" />

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Authorize</button>
        </div>
      </Card>
    </Page>
  );
}
