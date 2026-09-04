'use client';

import { Page, useTabs, SectionTitle } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { DataTable, Status, NameCell, type Column } from '@/components/ds/DataTable';
import { ADVISORS, ADVISOR_PENDING, type Advisor } from '@/lib/mock/advisors';
import p from '@/components/ds/Page.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';

const columns: Column<Advisor>[] = [
  { key: 'firm', header: 'Firm', muted: true, sortValue: (r) => r.firm ?? '', cell: (r) => r.firm ?? '-' },
  { key: 'name', header: 'Name', sortValue: (r) => r.name, cell: (r) => <NameCell name={r.name} /> },
  { key: 'email', header: 'Email', muted: true, sortValue: (r) => r.email },
  { key: 'role', header: 'Role', sortValue: (r) => r.role },
  { key: 'status', header: 'Status', cell: (r) => <Status value={r.status} /> },
];

export default function AdvisorsPage() {
  const tabs = useTabs([{ label: 'Advisors', count: ADVISORS.length }, { label: 'Pending approvals', count: 1 }]);

  return (
    <Page title="Advisors" actions={[{ label: 'Roles', icon: 'shield-check', href: '/settings/users/advisors/roles' }, { label: 'Invite advisor team', icon: 'user-plus', primary: true, href: '/settings/users/invite/advisors/details' }]}>
      {tabs.node}
      {tabs.active === 'Advisors' ? (
        <DataTable rows={ADVISORS} columns={columns} searchable
          searchKeys={(r) => `${r.name} ${r.email} ${r.firm ?? ''} ${r.role}`}
          countLabel={(n) => `${n} advisors`} />
      ) : (
        <>
          <SectionTitle>Pending approvals</SectionTitle>
          <Card style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, color: 'var(--ds-text-emphasized)' }}>{ADVISOR_PENDING.firm}</div>
                <div className={t.muted} style={{ fontSize: 13 }}>{ADVISOR_PENDING.note}</div>
              </div>
              <button className={p.btn} type="button">Decline</button>
              <button className={`${p.btn} ${p.btnPrimary}`} type="button">Review</button>
            </div>
          </Card>
        </>
      )}
    </Page>
  );
}
