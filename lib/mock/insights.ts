// Reference data for the interface.

export interface FlowRow { name: string; pct: number; amount: number | null; }
export const INSIGHTS_SUMMARY = { range: 'May 26 - Sep 03', netCashflow: 998012, moneyIn: 1900000, moneyOut: -911605 };
export const INSIGHTS_NARRATIVE = {
  runway: 'Net cash flow is -$2,970.23 YTD. Balances total $334.5K with a monthly burn rate of -$45.2k/mo.',
  moneyOut: 'Spending was -$303k across 182 transactions. In the prior period it was $33.4K across 226 transactions - an increase of $269.6K (89% more money out).',
  moneyIn: 'Money in reached $764,806 with GenPro contributing 54.2% and Google 14.6% of total inflows.',
};

export const TOP_SOURCES: FlowRow[] = [
  {
    name: "Venture Debt Loan",
    pct: 52.3,
    amount: 1000000.0
  },
  {
    name: "GenPro, Inc.",
    pct: 21.7,
    amount: 415133.44
  },
  {
    name: "Google",
    pct: 6.1,
    amount: 117782.43
  },
  {
    name: "Milgram Brokerage",
    pct: 4.4,
    amount: 84710.74
  },
  {
    name: "Orange, Inc.",
    pct: 3.8,
    amount: 73021.73
  },
  {
    name: "Check Deposit",
    pct: 2.9,
    amount: 55810.16
  },
  {
    name: "Monarch Books",
    pct: 2.0,
    amount: 38850.99
  },
  {
    name: "Remaining sources",
    pct: 6.5,
    amount: 124306.65
  }
];

export const TOP_RECIPIENTS: FlowRow[] = [
  {
    name: "GUSTO",
    pct: 29.5,
    amount: -268986.75
  },
  {
    name: "Google",
    pct: 13.0,
    amount: -118921.98
  },
  {
    name: "Jordi O'Donnell",
    pct: 9.9,
    amount: -90797.16
  },
  {
    name: "Milgram Brokerage",
    pct: 9.7,
    amount: -89061.6
  },
  {
    name: "Orange, Inc.",
    pct: 8.0,
    amount: -73011.09
  },
  {
    name: "Greenwich Capital",
    pct: 6.9,
    amount: -63218.83
  },
  {
    name: "Molitor Ventures",
    pct: 4.3,
    amount: -40012.34
  },
  {
    name: "Remaining recipients",
    pct: 18.3,
    amount: -167594.77
  }
];

