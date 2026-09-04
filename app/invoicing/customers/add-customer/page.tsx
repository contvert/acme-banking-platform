'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function AddCustomerPage() {
  return (
    <Page title="Add customer">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="customer-name">Customer name</label>
        <input id="customer-name" className={f.select} placeholder="Company or person" />
        <label className={f.label} htmlFor="email">Email</label>
        <input id="email" className={f.select} placeholder="billing@example.invalid" />
        <label className={f.label} htmlFor="payment-terms">Payment terms</label>
        <select id="payment-terms" className={f.select}>
          <option>Due on receipt</option>
          <option>Net 15</option>
          <option>Net 30</option>
          <option>Net 60</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Save customer</button>
        </div>
      </Card>
    </Page>
  );
}
