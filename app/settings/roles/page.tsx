'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, Status, type Column } from '@/components/ds/DataTable';
import { ROLES, type Role } from '@/lib/mock/settingsExtras';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<Role>[] = [
  { key: 'role', header: 'Role', sortValue: (r) => r.role },
  { key: 'description', header: 'Description', muted: true },
  { key: 'type', header: 'Type', muted: true, sortValue: (r) => r.type },
  { key: 'status', header: 'Status', cell: (r) => <Status value={r.status} /> },
];

export default function RolesPage() {
  const t = useT();
  return (
    <Page title={t('Roles')} actions={[{ label: t('Create role'), icon: 'plus', primary: true, href: '/settings/roles/create' }]}>
      <DataTable rows={ROLES} columns={columns} countLabel={(n) => `${n} roles`} />
    </Page>
  );
}
