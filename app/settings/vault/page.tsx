'use client';

import { Page, StatTiles, Note, Money, MoneyCompact } from '@/components/ds/Page';
import { VAULT } from '@/lib/mock/settingsData';
import { BRAND } from '@/lib/brand';
import { useT } from '@/components/i18n/I18nProvider';

export default function VaultPage() {
  const tr = useT();
  return (
    <Page title={`${BRAND.name} Vault`}>
      <Note>{tr('Your deposit accounts are FDIC insured up to')}<MoneyCompact value={VAULT.fdicLimit} />.
        This is the highest level of FDIC insurance currently available.
      </Note>
      <StatTiles
        tiles={[
          {
            label: tr('Checking / Savings balance'),
            value: <Money value={VAULT.checkingSavings} />,
            meta: <>{tr('Up to')}<MoneyCompact value={VAULT.fdicLimit} />{tr('FDIC insured')}</>,
          },
          {
            label: tr('Treasury'),
            value: `${VAULT.treasuryYield}%`,
            meta: 'Current portfolio yield',
          },
        ]}
      />
    </Page>
  );
}
