'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import p from '@/components/ds/Page.module.css';
import f from '@/app/send-money/transfer/Transfer.module.css';

export default function CreateRolePage() {
  return (
    <Page title="Create role">
      <Card style={{ maxWidth: 560 }}>
        <label className={f.label} htmlFor="role-name">Role name</label>
        <input id="role-name" className={f.select} placeholder="e.g. Finance Manager" />
        <label className={f.label} htmlFor="description">Description</label>
        <input id="description" className={f.select} placeholder="What this role can do" />
        <label className={f.label} htmlFor="based-on">Based on</label>
        <select id="based-on" className={f.select}>
          <option>Employee</option>
          <option>Money Mover</option>
          <option>Read Only</option>
          <option>Admin</option>
        </select>

        <div className={f.actions}>
          <button className={p.btn} type="button">Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button">Create role</button>
        </div>
      </Card>
    </Page>
  );
}
