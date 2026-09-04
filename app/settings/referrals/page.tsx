'use client';

import { Page, StatTiles, SectionTitle, Money } from '@/components/ds/Page';
import { DataTable, Status, NameCell, type Column } from '@/components/ds/DataTable';
import { REFERRALS, REFERRAL_STATS, REFERRAL_TIERS, type Referral } from '@/lib/mock/referrals';

const columns: Column<Referral>[] = [
  { key: 'company', header: 'Company', sortValue: (r) => r.company, cell: (r) => <NameCell name={r.company} /> },
  { key: 'kind', header: 'Kind', muted: true },
  { key: 'started', header: 'Application started', muted: true, sortValue: (r) => r.started },
  { key: 'status', header: 'Status', cell: (r) => <Status value={r.status} /> },
  { key: 'payout', header: 'Payout', numeric: true, muted: true, cell: (r) => r.payout ?? '-' },
];

export default function ReferralsPage() {
  return (
    <Page title="Referrals" actions={[{ label: 'Invite via email', icon: 'envelope', primary: true }]}>
      <StatTiles
        tiles={[
          { label: 'Referral bonus', value: <Money value={REFERRAL_STATS.bonus} />, meta: 'Each, when they deposit $10K within 90 days' },
          { label: 'Applied', value: REFERRAL_STATS.applied },
          { label: 'Account opened', value: REFERRAL_STATS.accountOpened },
          { label: 'Total earned', value: <Money value={REFERRAL_STATS.totalEarned} /> },
        ]}
      />
      <SectionTitle>Tiers</SectionTitle>
      <StatTiles
        tiles={REFERRAL_TIERS.map((t) => ({
          label: t.name,
          value: t.needed,
          meta: t.needed === 1 ? '1 referral' : `${t.needed} referrals`,
        }))}
      />
      <SectionTitle>Your referrals</SectionTitle>
      <DataTable rows={REFERRALS} columns={columns} searchable searchKeys={(r) => r.company}
        countLabel={(n) => `${n} referrals`} />
    </Page>
  );
}
