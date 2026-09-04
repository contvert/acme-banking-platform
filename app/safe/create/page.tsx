'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function CreateSafePage() {
  return (
    <Page title="Create a SAFE">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="investor">Investor name</label>
        <input id="investor" className={f.select} placeholder="Investor or fund" />
        <label className={f.label} htmlFor="amount">Investment amount</label>
        <input id="amount" className={f.select} placeholder="$0.00" />
        <label className={f.label} htmlFor="type">SAFE type</label>
        <select id="type" className={f.select}>
          <option>Valuation cap, no discount</option>
          <option>Discount, no valuation cap</option>
          <option>Valuation cap and discount</option>
          <option>MFN, no cap or discount</option>
        </select>
        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Create SAFE</button>
        </div>
      </Card>
    </Page>
  );
}
