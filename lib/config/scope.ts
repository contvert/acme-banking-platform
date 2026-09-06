import type { AppConfig } from './types';
import type { PublicUser } from '@/lib/auth/types';

/**
 * What a given user is allowed to see. An admin sees everything; a client sees
 * the accounts assigned to them — or all of them when none was assigned — and
 * only the cards, transactions and bank details that hang off those accounts.
 */
export function scopeConfig(config: AppConfig, user: PublicUser | null): AppConfig {
  if (!user || user.role === 'admin') return config;

  // No account picked means no restriction, which is what the administration
  // promises when none is ticked. Reading it as "nothing" instead left a new
  // client staring at an empty dashboard.
  const unrestricted = user.accountIds.length === 0;
  const allowed = new Set(user.accountIds);
  const visible = (accountId: string) => unrestricted || allowed.has(accountId);

  const accounts = config.accounts.filter((a) => visible(a.id));
  const currencies = new Set(accounts.map((a) => a.currency));

  return {
    ...config,
    accounts,
    cards: config.cards.filter((c) => visible(c.accountId)),
    transactions: config.transactions.filter((t) => visible(t.accountId)),
    // Bank details are per-currency rather than per-account; show the ones a
    // client could actually be asked to pay into.
    bankDetails: (config.bankDetails ?? []).filter((b) => currencies.has(b.currency)),
    // Beneficiary RIBs are private to the client who created them.
    recipients: (config.recipients ?? []).filter((r) => r.ownerUserId === user.id),
  };
}
