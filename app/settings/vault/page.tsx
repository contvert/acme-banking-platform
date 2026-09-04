'use client';

import { Page, StatTiles, Note, Money, MoneyCompact } from '@/components/ds/Page';
import { VAULT } from '@/lib/mock/settingsData';
import { BRAND } from '@/lib/brand';

export default function VaultPage() {
  return (
    <Page title={`${BRAND.name} Vault`}>
      <Note>
        Your deposit accounts are FDIC insured up to <MoneyCompact value={VAULT.fdicLimit} />.
        This is the highest level of FDIC insurance currently available.
      </Note>
      <StatTiles
        tiles={[
          {
            label: 'Checking / Savings balance',
            value: <Money value={VAULT.checkingSavings} />,
            meta: <>Up to <MoneyCompact value={VAULT.fdicLimit} /> FDIC insured</>,
          },
          {
            label: 'Treasury',
            value: `${VAULT.treasuryYield}%`,
            meta: 'Current portfolio yield',
          },
        ]}
      />
    </Page>
  );
}
