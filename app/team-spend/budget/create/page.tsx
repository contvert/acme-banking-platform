'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function CreateBudgetPage() {
  const tr = useT();
  return (
    <Page title={tr('Create budget')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="budget-name">{tr('Budget name')}</label>
        <input id="budget-name" className={f.select} placeholder={tr('e.g. Team Lunch')} />
        <label className={f.label} htmlFor="spend-limit">{tr('Spend limit')}</label>
        <input id="spend-limit" className={f.select} placeholder="$0.00" />
        <label className={f.label} htmlFor="spend-cycle">{tr('Spend cycle')}</label>
        <select id="spend-cycle" className={f.select}>
          <option>{tr('weekly')}</option>
          <option>{tr('monthly')}</option>
          <option>{tr('quarterly')}</option>
          <option>{tr('once')}</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Create budget')}</button>
        </div>
      </Card>
    </Page>
  );
}
