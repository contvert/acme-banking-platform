'use client';

import { Page, useTabs } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { APPROVAL_RULES } from '@/lib/mock/settingsData';

interface Rule { scope: string; rule: string; approver: string }

const columns: Column<Rule>[] = [
  { key: 'scope', header: 'Scope' },
  { key: 'rule', header: 'Condition', muted: true },
  { key: 'approver', header: 'Require approval from' },
];

export default function ApprovalsPage() {
  const tabs = useTabs([{ label: 'Per-payment' }, { label: 'Daily maximum' }, { label: 'Dual admin', count: 1 }]);
  const rows = APPROVAL_RULES.filter((r) => r.scope === tabs.active);

  return (
    <Page title="Approval Rules" actions={[{ label: 'Add rule', icon: 'plus', primary: true }]}>
      {tabs.node}
      <p style={{ fontSize: 15, color: 'var(--ds-text-secondary)', marginTop: 0 }}>
        Separation of duties prevents a payment requester from approving their own payment.
      </p>
      <DataTable rows={rows} columns={columns} emptyMessage="No rules for this scope." />
    </Page>
  );
}
