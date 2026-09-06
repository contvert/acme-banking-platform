'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function AddCatalogItemPage() {
  const tr = useT();
  return (
    <Page title={tr('Add catalog item')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="item-name">{tr('Item name')}</label>
        <input id="item-name" className={f.select} placeholder={tr('e.g. Advisory Retainer')} />
        <label className={f.label} htmlFor="description">{tr('Description')}</label>
        <input id="description" className={f.select} placeholder={tr('What the customer is buying')} />
        <label className={f.label} htmlFor="unit-price">{tr('Unit price')}</label>
        <input id="unit-price" className={f.select} placeholder="$0.00" />

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Save item')}</button>
        </div>
      </Card>
    </Page>
  );
}
