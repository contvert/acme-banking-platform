'use client';

import { Page, useTabs } from '@/components/ds/Page';
import { DataTable, Status, NameCell, type Column } from '@/components/ds/DataTable';
import { TEAM, type TeamMember } from '@/lib/mock/team';
import t from '@/components/dashboard/TransactionsTable.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<TeamMember>[] = [
  {
    key: 'name',
    header: 'Name',
    sortValue: (r) => r.name,
    cell: (r) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <NameCell name={r.name} />
        {r.you && <span className={`${t.status} ${t.statusNeutral}`}>you</span>}
      </span>
    ),
  },
  { key: 'email', header: 'Email', muted: true, sortValue: (r) => r.email },
  { key: 'role', header: 'Role', sortValue: (r) => r.role },
  { key: 'title', header: 'Job title', muted: true, cell: (r) => r.title ?? '—' },
  { key: 'department', header: 'Department', muted: true, cell: (r) => r.department ?? '—' },
  { key: 'status', header: 'Status', cell: (r) => <Status value={r.status} /> },
];

export default function TeamPage() {
  const translate = useT();
  const tabs = useTabs([{ label: translate('All'), count: TEAM.length }, { label: translate('Needs review') }]);

  return (
    <Page
      title={translate('Team')}
      actions={[
        { label: translate('Roles'), icon: 'shield-check', href: '/settings/roles' },
        { label: translate('Invite'), icon: 'user-plus', primary: true, href: '/settings/users/invite/advisors/details' },
      ]}
    >
      {tabs.node}
      <DataTable
        rows={TEAM}
        columns={columns}
        searchable
        searchKeys={(r) => `${r.name} ${r.email} ${r.role} ${r.department ?? ''}`}
        countLabel={(n) => `${n} ${n === 1 ? 'member' : 'members'}`}
      />
    </Page>
  );
}
