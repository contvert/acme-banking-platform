'use client';

import { Page, StatTiles, SectionTitle, useTabs, Money, Empty } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { SCHEDULE, LOAN_ACTIVITY, LOAN, type ScheduleRow, type ActivityRow } from '@/lib/mock/financing';

const scheduleColumns: Column<ScheduleRow>[] = [
  { key: 'date', header: 'Date', muted: true },
  { key: 'payment', header: 'Payment', numeric: true, cell: (r) => <Money value={r.payment} /> },
  { key: 'endingBalance', header: 'Ending Balance', numeric: true, cell: (r) => <Money value={r.endingBalance} /> },
];

const activityColumns: Column<ActivityRow>[] = [
  { key: 'date', header: 'Date', sortValue: (r) => r.date, muted: true },
  { key: 'description', header: 'Description' },
  { key: 'account', header: 'Account', muted: true },
  {
    key: 'amount', header: 'Amount', numeric: true,
    sortValue: (r) => r.amount ?? 0,
    cell: (r) => <Money value={r.amount} tone={(r.amount ?? 0) > 0 ? 'green' : 'default'} />,
  },
];

export default function FinancingPage() {
  const tabs = useTabs([
    { label: 'Working Capital' },
    { label: 'Venture Debt' },
    { label: 'SAFEs' },
  ]);

  return (
    <Page
      title="Financing"
      actions={[
        { label: 'Edit autopay', icon: 'repeat' },
        { label: 'Download loan agreement', icon: 'arrow-down-to-line' },
      ]}
    >
      {tabs.node}

      {tabs.active === 'Working Capital' ? (
        <>
          <StatTiles
            tiles={[
              {
                label: 'Outstanding balance',
                value: <Money value={LOAN.outstanding} />,
                meta: `${LOAN.paymentsLeft} payments left`,
              },
            ]}
          />

          <SectionTitle>Upcoming payments</SectionTitle>
          <DataTable rows={SCHEDULE} columns={scheduleColumns} />

          <SectionTitle>Activity</SectionTitle>
          <DataTable rows={LOAN_ACTIVITY} columns={activityColumns} />
        </>
      ) : (
        <Empty>No {tabs.active.toLowerCase()} in this account.</Empty>
      )}
    </Page>
  );
}
