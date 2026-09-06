export type AccountKind = 'checking' | 'savings' | 'credit' | 'treasury' | 'other';
export interface Account { name: string; kind: AccountKind; last4: string | null; balance: number | null; rule: string | null; }

// Reference data for the interface.
export const ACCOUNTS: Account[] = [];
