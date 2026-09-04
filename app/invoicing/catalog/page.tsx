'use client';

import { Page, Money } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { CATALOG, type CatalogItem } from '@/lib/mock/invoicingExtras';

const columns: Column<CatalogItem>[] = [
  { key: 'item', header: 'Item', sortValue: (r) => r.item },
  { key: 'description', header: 'Description', muted: true },
  { key: 'unitPrice', header: 'Unit price', numeric: true, sortValue: (r) => r.unitPrice ?? 0, cell: (r) => <Money value={r.unitPrice} /> },
  { key: 'lastUpdated', header: 'Last updated', muted: true },
];

export default function CatalogPage() {
  return (
    <Page title="Catalog" actions={[{ label: 'Add item', icon: 'plus', primary: true, href: '/invoicing/catalog/add-item' }]}>
      <DataTable rows={CATALOG} columns={columns} searchable
        searchKeys={(r) => `${r.item} ${r.description}`}
        countLabel={(n) => `${n} items`} />
    </Page>
  );
}
