'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function AddCatalogItemPage() {
  return (
    <Page title="Add catalog item">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="item-name">Item name</label>
        <input id="item-name" className={f.select} placeholder="e.g. Advisory Retainer" />
        <label className={f.label} htmlFor="description">Description</label>
        <input id="description" className={f.select} placeholder="What the customer is buying" />
        <label className={f.label} htmlFor="unit-price">Unit price</label>
        <input id="unit-price" className={f.select} placeholder="$0.00" />

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Save item</button>
        </div>
      </Card>
    </Page>
  );
}
