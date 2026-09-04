'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Page, StatTiles, SectionTitle, MoneyCompact } from '@/components/ds/Page';
import { DataTable, NameCell, type Column } from '@/components/ds/DataTable';
import { Money } from '@/components/ds/Money';
import { TOP_SOURCES, TOP_RECIPIENTS, INSIGHTS_SUMMARY, type FlowRow } from '@/lib/mock/insights';
import { INSIGHT_SPLITS } from '@/lib/mock/insightsSplits';

const columns = (header: string): Column<FlowRow>[] => [
  { key: 'name', header, sortValue: (r) => r.name, cell: (r) => <NameCell name={r.name} /> },
  { key: 'pct', header: '% of total', numeric: true, sortValue: (r) => r.pct, cell: (r) => `${r.pct.toFixed(1)}%` },
  {
    key: 'amount', header: 'Amount', numeric: true, sortValue: (r) => Math.abs(r.amount ?? 0),
    cell: (r) => <Money value={r.amount} tone={(r.amount ?? 0) > 0 ? 'green' : 'red'} />,
  },
];

export default function InsightSplitPage({ params }: { params: Promise<{ split: string }> }) {
  const { split } = use(params);
  if (split === 'overview') notFound();
  const meta = INSIGHT_SPLITS.find((s) => s.key === split);
  if (!meta) notFound();

  const isIn = meta.key === 'money-in';
  const rows = isIn ? TOP_SOURCES : TOP_RECIPIENTS;

  return (
    <Page title="Insights" actions={[{ label: 'Export', icon: 'arrow-down-to-line' }]}>
      <StatTiles
        tiles={[
          { label: meta.title, value: <MoneyCompact value={meta.total} tone={isIn ? 'green' : 'red'} />, meta: INSIGHTS_SUMMARY.range },
          { label: 'Monthly average', value: <MoneyCompact value={meta.monthlyAverage} tone={isIn ? 'green' : 'red'} /> },
        ]}
      />
      <SectionTitle>{isIn ? 'Top sources' : 'Top recipients'}</SectionTitle>
      <DataTable rows={rows} columns={columns(isIn ? 'Source' : 'Recipient')} />
    </Page>
  );
}
