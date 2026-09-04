'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';

interface AdvisorRole { role: string; description: string; scope: string }
const ROLES: AdvisorRole[] = [
  { role: 'Admin', description: 'Full control of the advisor relationship', scope: 'All accounts' },
  { role: 'Manager (Advisor)', description: 'Manages books and transactions', scope: 'Assigned accounts' },
  { role: 'Staff Accountant (Advisor)', description: 'Categorises and reconciles transactions', scope: 'Assigned accounts' },
];
const columns: Column<AdvisorRole>[] = [
  { key: 'role', header: 'Role', sortValue: (r) => r.role },
  { key: 'description', header: 'Description', muted: true },
  { key: 'scope', header: 'Scope', muted: true },
];

export default function AdvisorRolesPage() {
  return (
    <Page title="Advisor roles" actions={[{ label: 'Create role', icon: 'plus', primary: true, href: '/settings/roles/create' }]}>
      <DataTable rows={ROLES} columns={columns} countLabel={(n) => `${n} roles`} />
    </Page>
  );
}
