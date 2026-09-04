'use client';

import { Page, StatTiles, SectionTitle, Money, MoneyCompact } from '@/components/ds/Page';
import { DataTable, NameCell, type Column } from '@/components/ds/DataTable';
import { Card } from '@/components/ds/Card';
import {
  TOP_SOURCES, TOP_RECIPIENTS, INSIGHTS_SUMMARY, INSIGHTS_NARRATIVE, type FlowRow,
} from '@/lib/mock/insights';
import p from '@/components/ds/Page.module.css';

function flowColumns(nameHeader: string): Column<FlowRow>[] {
  return [
    { key: 'name', header: nameHeader, sortValue: (r) => r.name, cell: (r) => <NameCell name={r.name} /> },
    {
      key: 'pct', header: '% of total', numeric: true, sortValue: (r) => r.pct,
      cell: (r) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <span
            aria-hidden
            style={{
              width: 56, height: 5, borderRadius: 9999, display: 'inline-block',
              background: 'var(--ds-background-secondary)', overflow: 'hidden',
            }}
          >
            <span
              style={{
                display: 'block', height: '100%', width: `${Math.min(100, r.pct)}%`,
                background: 'var(--ds-data-visualization-segment-primary)',
              }}
            />
          </span>
          {r.pct.toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'amount', header: 'Amount', numeric: true, sortValue: (r) => Math.abs(r.amount ?? 0),
      cell: (r) => <Money value={r.amount} tone={(r.amount ?? 0) > 0 ? 'green' : 'red'} />,
    },
  ];
}

export default function InsightsPage() {
  return (
    <Page
      title="Insights"
      actions={[{ label: 'Export', icon: 'arrow-down-to-line' }]}
    >
      <StatTiles
        tiles={[
          {
            label: 'Net cashflow',
            value: <MoneyCompact value={INSIGHTS_SUMMARY.netCashflow} tone="green" />,
            meta: INSIGHTS_SUMMARY.range,
          },
          { label: 'Money in', value: <MoneyCompact value={INSIGHTS_SUMMARY.moneyIn} tone="green" /> },
          { label: 'Money out', value: <MoneyCompact value={INSIGHTS_SUMMARY.moneyOut} tone="red" /> },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 8 }}>
        <Card>
          <div className={p.tileLabel}>Runway and cash position</div>
          <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.5 }}>{INSIGHTS_NARRATIVE.runway}</p>
        </Card>
        <Card>
          <div className={p.tileLabel}>Money out trends</div>
          <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.5 }}>{INSIGHTS_NARRATIVE.moneyOut}</p>
        </Card>
        <Card>
          <div className={p.tileLabel}>Money in trends</div>
          <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.5 }}>{INSIGHTS_NARRATIVE.moneyIn}</p>
        </Card>
      </div>
      <p className={p.tileMeta}>Trends are generated and may include inaccuracies.</p>

      <SectionTitle>Top sources</SectionTitle>
      <DataTable rows={TOP_SOURCES} columns={flowColumns('Source')} />

      <SectionTitle>Top recipients</SectionTitle>
      <DataTable rows={TOP_RECIPIENTS} columns={flowColumns('Recipient')} />
    </Page>
  );
}
