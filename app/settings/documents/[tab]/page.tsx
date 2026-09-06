'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Page, Tabs } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { DOC_TABS } from '@/lib/mock/documents';
import p from '@/components/ds/Page.module.css';
import { useT } from '@/components/i18n/I18nProvider';

interface Row { cells: string[] }

export default function DocumentTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const translate = useT();
  const { tab } = use(params);
  const router = useRouter();
  const current = DOC_TABS.find((t) => t.slug === tab);

  if (!current) notFound();

  const headers = current.headers.length ? current.headers : ['Document'];
  const columns: Column<Row>[] = headers.map((h, i) => ({
    key: `c${i}`,
    headerText: h,
    muted: i > 0,
    sortValue: (r) => r.cells[i] ?? '',
    cell: (r) => r.cells[i] ?? '',
  }));
  columns.push({
    key: 'download',
    numeric: true,
    cell: () => <button className={p.btn} type="button">{translate('Download')}</button>,
  });

  const rows: Row[] = current.rows.map((cells) => ({ cells }));

  return (
    <Page title={translate('Documents & Data')} actions={[{ label: translate('Export all'), icon: 'arrow-down-to-line', href: '/settings/documents/statements' }]}>
      <Tabs
        tabs={DOC_TABS.map((t) => ({ label: t.label }))}
        active={current.label}
        onChange={(label) => {
          const next = DOC_TABS.find((t) => t.label === label);
          if (next) router.push(`/settings/documents/${next.slug}`);
        }}
      />
      <DataTable
        rows={rows}
        columns={columns}
        searchable
        searchKeys={(r) => r.cells.join(' ')}
        countLabel={(n) => `${n} ${n === 1 ? 'document' : 'documents'}`}
        emptyMessage="No documents in this category."
      />
    </Page>
  );
}
