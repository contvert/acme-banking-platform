'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function InviteAdvisorPage() {
  const tr = useT();
  return (
    <Page title={tr('Invite advisor team')}>
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="firm">{tr('Firm name')}</label>
        <input id="firm" className={f.select} placeholder={tr('Accounting firm')} />

        <label className={f.label} htmlFor="email">{tr('Work email')}</label>
        <input id="email" className={f.select} type="email" placeholder="name@firm.example" />

        <label className={f.label} htmlFor="role">{tr('Role')}</label>
        <select id="role" className={f.select} defaultValue="Manager (Advisor)">
          <option>{tr('Manager (Advisor)')}</option>
          <option>{tr('Staff Accountant (Advisor)')}</option>
          <option>{tr('Admin')}</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">{tr('Back')}</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">{tr('Send invite')}</button>
        </div>
      </Card>
    </Page>
  );
}
