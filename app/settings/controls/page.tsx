'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { ACH_FLAGGED } from '@/lib/mock/payments';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';

export default function ControlsPage() {
  return (
    <Page title="Controls">
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 16, color: 'var(--ds-text-emphasized)' }}>ACH authorization</span>
              <span className={`${t.status} ${t.statusOk}`}>Active</span>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--ds-text-secondary)', lineHeight: 1.5 }}>
              Designate which vendors may initiate ACH pulls (debits) from your account.
              Unauthorized pulls are flagged for review. {ACH_FLAGGED} currently flagged.
            </p>
            <p style={{ marginBottom: 0, fontSize: 15, color: 'var(--ds-text-tertiary)' }}>
              If the manual review window expires for a flagged transaction: automatically approve.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={p.btn} type="button">Edit</button>
            <button className={p.btn} type="button">Disable</button>
          </div>
        </div>
      </Card>
    </Page>
  );
}
