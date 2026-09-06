'use client';

import { Page, Money } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { CATALOG, type CatalogItem } from '@/lib/mock/invoicingExtras';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<CatalogItem>[] = [
  { key: 'item', header: 'Item', sortValue: (r) => r.item },
  { key: 'description', header: 'Description', muted: true },
  { key: 'unitPrice', header: 'Unit price', numeric: true, sortValue: (r) => r.unitPrice ?? 0, cell: (r) => <Money value={r.unitPrice} /> },
  { key: 'lastUpdated', header: 'Last updated', muted: true },
];

export default function CatalogPage() {
  const tr = useT();
  return (
    <Page title={tr('Catalog')} actions={[{ label: tr('Add item'), icon: 'plus', primary: true, href: '/invoicing/catalog/add-item' }]}>
      <DataTable rows={CATALOG} columns={columns} searchable
        searchKeys={(r) => `${r.item} ${r.description}`}
        countLabel={(n) => `${n} items`} />
    </Page>
  );
}
