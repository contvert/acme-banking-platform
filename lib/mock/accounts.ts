export type AccountKind = 'checking' | 'savings' | 'credit' | 'treasury' | 'other';
export interface Account { name: string; kind: AccountKind; last4: string | null; balance: number | null; rule: string | null; }

// Reference data for the interface.
export const ACCOUNTS: Account[] = [
  {
    name: "Credit Card",
    kind: "credit",
    last4: null,
    balance: 12505.87,
    rule: "Autopay from Ops / Payroll Every 22nd of the month or if <80% of limit left"
  },
  {
    name: "Treasury",
    kind: "treasury",
    last4: null,
    balance: 200000.0,
    rule: null
  },
  {
    name: "Ops / Payroll",
    kind: "checking",
    last4: "1038",
    balance: 2023267.12,
    rule: null
  },
  {
    name: "AP",
    kind: "checking",
    last4: "1794",
    balance: 226767.82,
    rule: null
  },
  {
    name: "AR",
    kind: "checking",
    last4: "4296",
    balance: 0.0,
    rule: null
  },
  {
    name: "Checking",
    kind: "checking",
    last4: "0297",
    balance: 1374471.14,
    rule: null
  },
  {
    name: "Savings ••7658",
    kind: "savings",
    last4: "7658",
    balance: 1320201.0,
    rule: null
  }
];
