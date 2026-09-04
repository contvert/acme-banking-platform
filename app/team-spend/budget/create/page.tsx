'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function CreateBudgetPage() {
  return (
    <Page title="Create budget">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="budget-name">Budget name</label>
        <input id="budget-name" className={f.select} placeholder="e.g. Team Lunch" />
        <label className={f.label} htmlFor="spend-limit">Spend limit</label>
        <input id="spend-limit" className={f.select} placeholder="$0.00" />
        <label className={f.label} htmlFor="spend-cycle">Spend cycle</label>
        <select id="spend-cycle" className={f.select}>
          <option>weekly</option>
          <option>monthly</option>
          <option>quarterly</option>
          <option>once</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Create budget</button>
        </div>
      </Card>
    </Page>
  );
}
