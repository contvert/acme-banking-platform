import type { AppConfig } from './types';
import type { PublicUser } from '@/lib/auth/types';

/**
 * What a given user is allowed to see. An admin sees everything; a client sees
 * only the accounts assigned to them, and only the cards, transactions and bank
 * details that hang off those accounts.
 */
export function scopeConfig(config: AppConfig, user: PublicUser | null): AppConfig {
  if (!user || user.role === 'admin' || user.accountIds.length === 0) return config;

  const allowed = new Set(user.accountIds);
  const accounts = config.accounts.filter((a) => allowed.has(a.id));
  const currencies = new Set(accounts.map((a) => a.currency));

  return {
    ...config,
    accounts,
    cards: config.cards.filter((c) => allowed.has(c.accountId)),
    transactions: config.transactions.filter((t) => allowed.has(t.accountId)),
    // Bank details are per-currency rather than per-account; show the ones a
    // client could actually be asked to pay into.
    bankDetails: (config.bankDetails ?? []).filter((b) => currencies.has(b.currency)),
  };
}
