'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, Status, type Column } from '@/components/ds/DataTable';
import { ROLES, type Role } from '@/lib/mock/settingsExtras';

const columns: Column<Role>[] = [
  { key: 'role', header: 'Role', sortValue: (r) => r.role },
  { key: 'description', header: 'Description', muted: true },
  { key: 'type', header: 'Type', muted: true, sortValue: (r) => r.type },
  { key: 'status', header: 'Status', cell: (r) => <Status value={r.status} /> },
];

export default function RolesPage() {
  return (
    <Page title="Roles" actions={[{ label: 'Create role', icon: 'plus', primary: true, href: '/settings/roles/create' }]}>
      <DataTable rows={ROLES} columns={columns} countLabel={(n) => `${n} roles`} />
    </Page>
  );
}
