// Dashboard figures, transcribed from the reference interface.

export const USER = { firstName: '', lastName: '' };

export const TOTAL_BALANCE = 0;

export const BALANCE_RANGE = { label: 'Last 30 days', high: 455851, low: 300000 };

/** Normalised (0–1) points; the tooltip maps them onto BALANCE_RANGE. */
export const BALANCE_SERIES: { date: string; value: number }[] = [
  { date: '2026-08-09', value: 0.10 },
  { date: '2026-08-11', value: 0.16 },
  { date: '2026-08-13', value: 0.14 },
  { date: '2026-08-15', value: 0.22 },
  { date: '2026-08-17', value: 0.30 },
  { date: '2026-08-19', value: 0.28 },
  { date: '2026-08-21', value: 0.38 },
  { date: '2026-08-23', value: 0.45 },
  { date: '2026-08-25', value: 0.52 },
  { date: '2026-08-27', value: 0.50 },
  { date: '2026-08-29', value: 0.61 },
  { date: '2026-08-31', value: 0.69 },
  { date: '2026-09-02', value: 0.78 },
  { date: '2026-09-04', value: 0.90 },
  { date: '2026-09-06', value: 1.0 },
];

export const CREDIT = {
  balance: 0,
  available: 0,
  limit: 0,
  pending: 0,
  autopayDate: '',
};

export const BILL_PAY = {
  outstanding: 0,
  overdue: 0,
  dueSoon: null as number | null,
  inboxItems: 0,
  inboxAmount: 0,
};

export const INVOICING = {
  overdueCount: 0, overdueAmount: 0,
  paidCount: 0, paidAmount: 0,
  openCount: 0, openAmount: 0,
};

export const MONEY_MOVEMENT = {
  period: '',
  in: {
    total: 0,
    threeMonthAverage: 0,
    top: [],
  },
  out: {
    total: 0,
    threeMonthAverage: 0,
    top: [],
  },
};

export const TRANSACTION_VIEWS = [
  'Recent', 'My transactions', 'Monthly money in', 'Monthly money out', 'Operating expenses',
] as const;
