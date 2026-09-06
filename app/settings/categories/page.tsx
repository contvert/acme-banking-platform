'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { CATEGORIES } from '@/lib/mock/settingsExtras';
import { Icon } from '@/components/ds/Icon';
import { useT } from '@/components/i18n/I18nProvider';

interface Row { name: string }
const rows: Row[] = CATEGORIES.map((name) => ({ name }));

const columns: Column<Row>[] = [
  { key: 'name', header: 'Category', sortValue: (r) => r.name },
  { key: 'reimbursements', header: 'Reimbursements', cell: () => <Icon name="check" size={13} /> },
  { key: 'cardSpend', header: 'Card spend', cell: () => <Icon name="check" size={13} /> },
  { key: 'other', header: 'Other', cell: () => <Icon name="check" size={13} /> },
];

export default function CategoriesPage() {
  const t = useT();
  return (
    <Page title={t('Categories')} actions={[{ label: t('Add category'), icon: 'plus', primary: true }]}>
      <DataTable rows={rows} columns={columns} searchable searchKeys={(r) => r.name}
        countLabel={(n) => `${n} categories`} />
    </Page>
  );
}
