'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function CreateRolePage() {
  const tr = useT();
  return (
    <Page title={tr('Create role')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="role-name">{tr('Role name')}</label>
        <input id="role-name" className={f.select} placeholder={tr('e.g. Finance Manager')} />
        <label className={f.label} htmlFor="description">{tr('Description')}</label>
        <input id="description" className={f.select} placeholder={tr('What this role can do')} />
        <label className={f.label} htmlFor="based-on">{tr('Based on')}</label>
        <select id="based-on" className={f.select}>
          <option>{tr('Employee')}</option>
          <option>{tr('Money Mover')}</option>
          <option>{tr('Read Only')}</option>
          <option>{tr('Admin')}</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Create role')}</button>
        </div>
      </Card>
    </Page>
  );
}
