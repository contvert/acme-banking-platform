// Reference data for the interface.

export interface ScheduleRow { date: string; payment: number | null; endingBalance: number | null; }
export interface ActivityRow { date: string; description: string; account: string; amount: number | null; }
export const LOAN = { outstanding: 30800, paymentsLeft: 13 };

export const SCHEDULE: ScheduleRow[] = [
  {
    date: "September 9",
    payment: 2199.99,
    endingBalance: 42000.0
  },
  {
    date: "September 16",
    payment: 3299.97,
    endingBalance: 79000.0
  },
  {
    date: "September 23",
    payment: 3299.97,
    endingBalance: 76000.0
  }
];

export const LOAN_ACTIVITY: ActivityRow[] = [
  {
    date: "Sep 3",
    description: "Working capital loan payment",
    account: "Acme Checking ••1038",
    amount: -2200.0
  },
  {
    date: "Aug 30",
    description: "Working capital loan payment",
    account: "Acme Checking ••1038",
    amount: -2200.0
  },
  {
    date: "Aug 20",
    description: "Working capital deposit",
    account: "Acme Checking ••1038",
    amount: 30000.0
  },
  {
    date: "Aug 13",
    description: "Working capital loan accrued advance fee",
    account: "Acme Checking ••1038",
    amount: -200.0
  }
];

