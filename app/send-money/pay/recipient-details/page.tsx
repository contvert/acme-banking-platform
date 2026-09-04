'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function RecipientDetailsPage() {
  return (
    <Page title="Recipient details">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="recipient-name">Recipient name</label>
        <input id="recipient-name" className={f.select} placeholder="Company or person" />
        <label className={f.label} htmlFor="routing-number">Routing number</label>
        <input id="routing-number" className={f.select} placeholder="9 digits" />
        <label className={f.label} htmlFor="account-number">Account number</label>
        <input id="account-number" className={f.select} placeholder="Account number" />
        <label className={f.label} htmlFor="payment-method">Payment method</label>
        <select id="payment-method" className={f.select}>
          <option>ACH</option>
          <option>Domestic Wire</option>
          <option>International Wire</option>
          <option>Check</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Continue</button>
        </div>
      </Card>
    </Page>
  );
}
