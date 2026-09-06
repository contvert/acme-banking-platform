'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { useT } from '@/components/i18n/I18nProvider';
import type { Message } from '@/lib/i18n/messages/catalog';
import type { Translate } from '@/lib/i18n/translate';

interface AdvisorRole { role: Message; description: Message; scope: Message }
const ROLES: AdvisorRole[] = [
  { role: 'Admin', description: 'Full control of the advisor relationship', scope: 'All accounts' },
  { role: 'Manager (Advisor)', description: 'Manages books and transactions', scope: 'Assigned accounts' },
  { role: 'Staff Accountant (Advisor)', description: 'Categorises and reconciles transactions', scope: 'Assigned accounts' },
];
/** Built from the translator so the cells read in the reader's language too. */
const columns = (t: Translate): Column<AdvisorRole>[] => [
  { key: 'role', header: 'Role', sortValue: (r) => r.role, cell: (r) => t(r.role) },
  { key: 'description', header: 'Description', muted: true, cell: (r) => t(r.description) },
  { key: 'scope', header: 'Scope', muted: true, cell: (r) => t(r.scope) },
];

export default function AdvisorRolesPage() {
  const tr = useT();
  return (
    <Page title={tr('Advisor roles')} actions={[{ label: tr('Create role'), icon: 'plus', primary: true, href: '/settings/roles/create' }]}>
      <DataTable
        rows={ROLES}
        columns={columns(tr)}
        countLabel={(n) => tr('{count} roles', { count: n })}
      />
    </Page>
  );
}
