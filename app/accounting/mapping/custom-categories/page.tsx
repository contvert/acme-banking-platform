'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { CATEGORIES } from '@/lib/mock/settingsExtras';
import p from '@/components/ds/Page.module.css';

interface Row { name: string }
const rows: Row[] = CATEGORIES.map((name) => ({ name }));
const columns: Column<Row>[] = [
  { key: 'name', header: 'Category', sortValue: (r) => r.name },
  { key: 'glCode', header: 'GL code', muted: true, cell: () => 'Not mapped' },
  { key: 'edit', header: '', numeric: true, cell: () => <button className={p.btn} type="button">Map</button> },
];

export default function CustomCategoriesPage() {
  return (
    <Page title="Custom categories" actions={[{ label: 'Add category', icon: 'plus', primary: true }]}>
      <DataTable rows={rows} columns={columns} searchable searchKeys={(r) => r.name}
        countLabel={(n) => `${n} categories`} />
    </Page>
  );
}
