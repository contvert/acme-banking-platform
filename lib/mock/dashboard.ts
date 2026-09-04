// Dashboard figures, transcribed from the reference interface.

export const USER = { firstName: 'Jane', lastName: 'Black' };

export const TOTAL_BALANCE = 5_216_471.18;

export const BALANCE_RANGE = { label: 'Last 30 days', high: 1_800_000, low: -488_000 };

/**
 * 30-day balance series. The reference interface renders this as an area chart with a
 * rising trend and a late pullback; values are reconstructed to that shape and
 * scaled to the card's own axis, not to the account total.
 */
export const BALANCE_SERIES: { date: string; value: number }[] = [
  { date: 'Aug 5', value: 0.30 }, { date: 'Aug 6', value: 0.28 }, { date: 'Aug 7', value: 0.33 },
  { date: 'Aug 8', value: 0.31 }, { date: 'Aug 9', value: 0.35 }, { date: 'Aug 10', value: 0.34 },
  { date: 'Aug 11', value: 0.38 }, { date: 'Aug 12', value: 0.36 }, { date: 'Aug 13', value: 0.41 },
  { date: 'Aug 14', value: 0.43 }, { date: 'Aug 15', value: 0.40 }, { date: 'Aug 16', value: 0.46 },
  { date: 'Aug 17', value: 0.48 }, { date: 'Aug 18', value: 0.45 }, { date: 'Aug 19', value: 0.52 },
  { date: 'Aug 20', value: 0.58 }, { date: 'Aug 21', value: 0.55 }, { date: 'Aug 22', value: 0.57 },
  { date: 'Aug 23', value: 0.62 }, { date: 'Aug 24', value: 0.60 }, { date: 'Aug 25', value: 0.66 },
  { date: 'Aug 26', value: 0.71 }, { date: 'Aug 27', value: 0.74 }, { date: 'Aug 28', value: 0.79 },
  { date: 'Aug 29', value: 0.86 }, { date: 'Aug 30', value: 0.93 }, { date: 'Aug 31', value: 0.90 },
  { date: 'Sep 1', value: 0.88 }, { date: 'Sep 2', value: 0.91 }, { date: 'Sep 3', value: 0.89 },
];

export const CREDIT = {
  balance: 12_505.87,
  available: 21_249,
  limit: 35_000,
  pending: 1_245.13,
  autopayDate: 'Sep 8',
};

export const BILL_PAY = {
  outstanding: 11,
  overdue: 1,
  dueSoon: null as number | null,
  inboxItems: 3,
  inboxAmount: 10_000,
};

export const INVOICING = {
  overdueCount: 4, overdueAmount: 950,
  paidCount: 12, paidAmount: 6_000,
  openCount: 12, openAmount: 12_300,
};

export const MONEY_MOVEMENT = {
  period: 'Sep 2026',
  in: {
    total: 37_953.33,
    threeMonthAverage: 624_000,
    top: [
      { name: 'Google', amount: 12_094.22 },
      { name: 'Milgram Brokerage', amount: 5_955.63 },
      { name: 'Orange, Inc.', amount: 5_533.51 },
      { name: 'Monarch Books', amount: 3_330.97 },
    ],
  },
  out: {
    total: -57_291.17,
    threeMonthAverage: -272_000,
    top: [
      { name: 'Google', amount: -10_457.99 },
      { name: 'Milgram Brokerage', amount: -9_633.57 },
      { name: 'Orange, Inc.', amount: -5_697.64 },
      { name: 'Lighthouse Properties #3431', amount: -5_250.00 },
    ],
  },
};

export const TRANSACTION_VIEWS = [
  'Recent', 'My transactions', 'Monthly money in', 'Monthly money out', 'Operating expenses',
] as const;
