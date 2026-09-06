'use client';

import { Page, useTabs, SectionTitle, Empty } from '@/components/ds/Page';
import { DataTable, Status, NameCell, type Column } from '@/components/ds/DataTable';
import { Icon } from '@/components/ds/Icon';
import { TAX_ALERTS, TAX_FILERS, TAX_YEAR, IRS_DEADLINE, type TaxFiler } from '@/lib/mock/taxes';
import t from '@/components/dashboard/TransactionsTable.module.css';
import p from '@/components/ds/Page.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const columns: Column<TaxFiler>[] = [
  { key: 'name', header: 'Name', sortValue: (r) => r.name, cell: (r) => <NameCell name={r.name} /> },
  { key: 'w9', header: 'W-9', cell: (r) => <Status value={r.w9} /> },
  { key: 'nec', header: '1099-NEC', numeric: true, muted: true },
  { key: 'misc', header: '1099-MISC', numeric: true, muted: true },
];

export default function TaxesPage() {
  const translate = useT();
  const tabs = useTabs([{ label: translate('1099 Filing') }, { label: translate('Tax Documents') }]);

  return (
    <Page
      title={translate('Taxes')}
      pill="Pro"
      actions={[
        { label: `Tax Year: ${TAX_YEAR}`, icon: 'calendar' },
        { label: translate('Add recipient'), icon: 'user-plus', primary: true, href: '/payments/recipients/create/request' },
      ]}
    >
      <div className={p.note} style={{ background: 'var(--ds-background-warning)' }}>
        <Icon name="clock" size={15} />
        <span>{translate('IRS deadline')}<strong>{IRS_DEADLINE}</strong></span>
      </div>

      {tabs.node}

      {tabs.active === '1099 Filing' ? (
        <>
          <SectionTitle>{translate('Filing updates and tasks')}</SectionTitle>
          <div className={t.wrap} style={{ marginBottom: 24 }}>
            {TAX_ALERTS.map((a) => (
              <div
                key={a.text}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, fontSize: 16,
                  padding: '12px 20px', borderBottom: '1px solid var(--ds-border-default)',
                }}
              >
                <Icon name="triangle-exclamation" size={14} />
                <span style={{ flex: 1 }}>{a.text}</span>
                {a.action && <button className={p.btn} type="button">{a.action}</button>}
              </div>
            ))}
          </div>

          <SectionTitle>1099 filing recipients</SectionTitle>
          <DataTable
            rows={TAX_FILERS}
            columns={columns}
            searchable
            searchKeys={(r) => r.name}
            countLabel={(n) => `${n} ${n === 1 ? 'recipient' : 'recipients'}`}
          />
        </>
      ) : (
        <Empty>{translate('Tax documents appear here once filings are complete.')}</Empty>
      )}
    </Page>
  );
}
