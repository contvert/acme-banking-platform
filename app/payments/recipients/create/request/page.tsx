'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function RequestRecipientPage() {
  return (
    <Page title="Request payment details">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="recipient-name">Recipient name</label>
        <input id="recipient-name" className={f.select} placeholder="Company or person" />
        <label className={f.label} htmlFor="email">Email</label>
        <input id="email" className={f.select} placeholder="name@example.invalid" />
        <label className={f.label} htmlFor="message">Message</label>
        <input id="message" className={f.select} placeholder="Optional note" />

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Send request</button>
        </div>
      </Card>
    </Page>
  );
}
