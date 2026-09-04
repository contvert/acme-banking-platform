'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function InviteAdvisorPage() {
  return (
    <Page title="Invite advisor team">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="firm">Firm name</label>
        <input id="firm" className={f.select} placeholder="Accounting firm" />

        <label className={f.label} htmlFor="email">Work email</label>
        <input id="email" className={f.select} type="email" placeholder="name@firm.example" />

        <label className={f.label} htmlFor="role">Role</label>
        <select id="role" className={f.select} defaultValue="Manager (Advisor)">
          <option>Manager (Advisor)</option>
          <option>Staff Accountant (Advisor)</option>
          <option>Admin</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Send invite</button>
        </div>
      </Card>
    </Page>
  );
}
