'use client';

import { useMemo } from 'react';
import { useConfig } from '@/components/config/ConfigProvider';
import type { Account } from '@/lib/mock/accounts';
import type { Card } from '@/lib/mock/cards';
import type { Transaction } from '@/lib/mock/transactions';

/**
 * The pages were built against the scraped mock shapes. Rather than rewrite
 * every one, these hooks project the live config into those same shapes, so a
 * page swaps a static import for a hook and nothing else changes.
 */

export function useAccounts(): Account[] {
  const { config } = useConfig();
  return useMemo(
    () =>
      config.accounts.map((a) => ({
        name: a.name,
        kind: a.kind,
        last4: a.last4 || null,
        balance: a.balance,
        rule: null,
      })),
    [config.accounts],
  );
}

export function useCards(): Card[] {
  const { config } = useConfig();
  return useMemo(
    () =>
      config.cards.map((c) => {
        const account = config.accounts.find((a) => a.id === c.accountId);
        return {
          holder: c.holder,
          last4: c.last4,
          label: c.label || null,
          spentThisMonth: c.spentThisMonth,
          type: c.type,
          account: account?.name ?? '—',
          // A disabled card reads as suspended wherever a status is shown.
          status: (!c.enabled || c.status === 'suspended'
            ? 'suspended'
            : c.status === 'frozen'
              ? 'frozen'
              : 'active') as Card['status'],
          budgets: 0,
        };
      }),
    [config.cards, config.accounts],
  );
}

export function useTransactions(): Transaction[] {
  const { config } = useConfig();
  return useMemo(
    () =>
      [...config.transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((t) => {
          const account = config.accounts.find((a) => a.id === t.accountId);
          return {
            date: t.date,
            party: t.party,
            amount: t.amount,
            account: account?.name ?? '—',
            method: t.method,
            status: t.status === 'completed' ? null : t.status,
          };
        }),
    [config.transactions, config.accounts],
  );
}

/** The company block, in the shape the settings pages already render. */
export function useCompany() {
  const { config } = useConfig();
  return config.company;
}
