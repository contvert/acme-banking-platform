export interface Transaction { date: string; party: string; amount: number | null; account: string; method: string; status: string | null; }

// Reference data for the interface.
export const TRANSACTIONS: Transaction[] = [
  {
    date: "Sep 3",
    party: "Working Capital",
    amount: -2200.0,
    account: "Ops / Payroll",
    method: "Working Capital Loan Payment",
    status: null
  },
  {
    date: "Sep 3",
    party: "Payment from NASA",
    amount: 419.0,
    account: "AR",
    method: "Request or Invoice Payment",
    status: "failed"
  },
  {
    date: "Sep 3",
    party: "Payment from Acme Corp",
    amount: 200.0,
    account: "AR",
    method: "Request or Invoice Payment",
    status: null
  },
  {
    date: "Sep 3",
    party: "To Ops / Payroll",
    amount: -55810.16,
    account: "AR",
    method: "Transfer",
    status: null
  },
  {
    date: "Sep 3",
    party: "From AR",
    amount: 55810.16,
    account: "Ops / Payroll",
    method: "Transfer",
    status: null
  },
  {
    date: "Sep 3",
    party: "Lily's Eatery",
    amount: 0.93,
    account: "Ops / Payroll",
    method: "Alice C. ••1234",
    status: null
  },
  {
    date: "Sep 3",
    party: "Deli 77",
    amount: 63.53,
    account: "Credit account",
    method: "Mary M. ••0332",
    status: null
  },
  {
    date: "Sep 3",
    party: "Deli 77",
    amount: 214.06,
    account: "Ops / Payroll",
    method: "Jane B. ••6112",
    status: null
  },
  {
    date: "Sep 3",
    party: "Office Stop Co.",
    amount: -287.89,
    account: "Ops / Payroll",
    method: "Jessica A. ••9914",
    status: null
  },
  {
    date: "Sep 3",
    party: "Domestic Ads",
    amount: -82.75,
    account: "Ops / Payroll",
    method: "Real-Time Payment",
    status: null
  },
  {
    date: "Sep 3",
    party: "Trader John's",
    amount: 855.81,
    account: "Credit account",
    method: "Landon S. ••0331",
    status: null
  },
  {
    date: "Sep 3",
    party: "Pending Deposit",
    amount: 1000.0,
    account: "AP",
    method: "Check Deposit",
    status: null
  },
  {
    date: "Sep 3",
    party: "Office Stop Co.",
    amount: -662.7,
    account: "Credit account",
    method: "Jane B. ••0330",
    status: null
  },
  {
    date: "Sep 3",
    party: "Office Stop Co.",
    amount: 563.94,
    account: "Credit account",
    method: "Jane B. ••0330",
    status: null
  },
  {
    date: "Sep 3",
    party: "The Plant Organic Cafe",
    amount: -203.03,
    account: "Ops / Payroll",
    method: "Landon S. ••4929",
    status: null
  },
  {
    date: "Sep 3",
    party: "Trader John's",
    amount: -189.12,
    account: "Ops / Payroll",
    method: "Alice C. ••6231",
    status: null
  },
  {
    date: "Sep 3",
    party: "Milgram Brokerage",
    amount: 2760.75,
    account: "Ops / Payroll",
    method: "Jane B. ••3745",
    status: null
  },
  {
    date: "Sep 3",
    party: "Monarch Books",
    amount: 423.13,
    account: "Ops / Payroll",
    method: "Alice C. ••7840",
    status: null
  },
  {
    date: "Sep 3",
    party: "GenPro",
    amount: 150.25,
    account: "Ops / Payroll",
    method: "Real-Time Payment In",
    status: null
  },
  {
    date: "Sep 3",
    party: "Lily's Eatery",
    amount: 25.89,
    account: "Credit account",
    method: "Jane B. ••5555",
    status: null
  },
  {
    date: "Sep 3",
    party: "Office Stop Co.",
    amount: 289.14,
    account: "Ops / Payroll",
    method: "Jessica A. ••9914",
    status: null
  },
  {
    date: "Sep 3",
    party: "Trader John's",
    amount: -787.74,
    account: "Credit account",
    method: "Landon S. ••0331",
    status: null
  },
  {
    date: "Sep 3",
    party: "Orange, Inc.",
    amount: -450.81,
    account: "Credit account",
    method: "Carry B. ••7821",
    status: null
  },
  {
    date: "Sep 3",
    party: "From Acme Savings ••7658",
    amount: 40000.0,
    account: "AP",
    method: "Transfer",
    status: null
  },
  {
    date: "Sep 3",
    party: "To AP",
    amount: -40000.0,
    account: "Savings ••7658",
    method: "Transfer",
    status: null
  },
  {
    date: "Sep 3",
    party: "Jameson Accounting",
    amount: 43450.5,
    account: "Ops / Payroll",
    method: "Check Deposit",
    status: null
  },
  {
    date: "Sep 3",
    party: "Monarch Books",
    amount: -933.72,
    account: "Ops / Payroll",
    method: "Alice C. ••7840",
    status: null
  },
  {
    date: "Sep 3",
    party: "Nutritionist",
    amount: -1010.0,
    account: "AP",
    method: "Intl. Wire",
    status: null
  },
  {
    date: "Sep 3",
    party: "Google",
    amount: -287.91,
    account: "Ops / Payroll",
    method: "Jessica A. ••4000",
    status: null
  },
  {
    date: "Sep 3",
    party: "Lily's Eatery",
    amount: -26.05,
    account: "Ops / Payroll",
    method: "Alice C. ••1234",
    status: null
  },
  {
    date: "Sep 3",
    party: "Contractor",
    amount: -1250.0,
    account: "AP",
    method: "Real-Time Payment",
    status: null
  },
  {
    date: "Sep 3",
    party: "Lighthouse Properties #3431",
    amount: -5250.0,
    account: "AP",
    method: "ACH Payment",
    status: null
  },
  {
    date: "Sep 3",
    party: "Nutritionist",
    amount: -1041.8,
    account: "AP",
    method: "Intl. Wire",
    status: null
  },
  {
    date: "Sep 3",
    party: "The Plant Organic Cafe",
    amount: 363.45,
    account: "Credit account",
    method: "Sally P. ••4192",
    status: null
  },
  {
    date: "Sep 3",
    party: "Trader John's",
    amount: 235.67,
    account: "Ops / Payroll",
    method: "Alice C. ••6231",
    status: null
  },
  {
    date: "Sep 3",
    party: "Lily's Eatery",
    amount: -32.5,
    account: "Credit account",
    method: "Jane B. ••5555",
    status: null
  },
  {
    date: "Sep 3",
    party: "Orange, Inc.",
    amount: 2147.57,
    account: "Ops / Payroll",
    method: "Jane B. ••4928",
    status: null
  },
  {
    date: "Sep 3",
    party: "The Plant Organic Cafe",
    amount: -145.39,
    account: "Credit account",
    method: "Sally P. ••4192",
    status: null
  },
  {
    date: "Sep 3",
    party: "Monarch Books",
    amount: 410.76,
    account: "Credit account",
    method: "Landon S. ••5555",
    status: null
  },
  {
    date: "Sep 3",
    party: "Milgram Brokerage",
    amount: -2465.32,
    account: "Ops / Payroll",
    method: "Jane B. ••3745",
    status: null
  },
  {
    date: "Sep 3",
    party: "Google",
    amount: 1952.15,
    account: "Credit account",
    method: "Jessica A. ••4039",
    status: null
  },
  {
    date: "Sep 3",
    party: "Deli 77",
    amount: -697.04,
    account: "Ops / Payroll",
    method: "Jane B. ••6112",
    status: null
  },
  {
    date: "Sep 3",
    party: "Deli 77",
    amount: -341.81,
    account: "Credit account",
    method: "Mary M. ••0332",
    status: null
  },
  {
    date: "Sep 3",
    party: "Orange, Inc.",
    amount: -1524.06,
    account: "Ops / Payroll",
    method: "Jane B. ••4928",
    status: null
  },
  {
    date: "Sep 3",
    party: "Google",
    amount: -3760.82,
    account: "Credit account",
    method: "Jessica A. ••4039",
    status: null
  },
  {
    date: "Sep 3",
    party: "Orange, Inc.",
    amount: 1428.27,
    account: "Credit account",
    method: "Carry B. ••7821",
    status: null
  },
  {
    date: "Sep 3",
    party: "The Plant Organic Cafe",
    amount: 9.12,
    account: "Ops / Payroll",
    method: "Landon S. ••4929",
    status: null
  },
  {
    date: "Sep 3",
    party: "Milgram Brokerage",
    amount: -1943.01,
    account: "Credit account",
    method: "Jane B. ••3054",
    status: null
  },
  {
    date: "Sep 3",
    party: "Milgram Brokerage",
    amount: 1380.38,
    account: "Credit account",
    method: "Jane B. ••3054",
    status: null
  },
  {
    date: "Sep 3",
    party: "Monarch Books",
    amount: -402.67,
    account: "Credit account",
    method: "Landon S. ••5555",
    status: null
  },
  {
    date: "Sep 3",
    party: "Google",
    amount: 3949.0,
    account: "Ops / Payroll",
    method: "Jessica A. ••4000",
    status: null
  },
  {
    date: "Sep 3",
    party: "Blue Bottle Coffee Acme Gift",
    amount: -7.32,
    account: "Credit account",
    method: "Jane B. ••5555",
    status: null
  },
  {
    date: "Sep 3",
    party: "Miles Davidson",
    amount: -706.7,
    account: "AP",
    method: "Check Payment",
    status: null
  },
  {
    date: "Sep 3",
    party: "Debug LLC",
    amount: -450.5,
    account: "Ops / Payroll",
    method: "Real-Time Payment",
    status: "failed"
  },
  {
    date: "Sep 3",
    party: "Nutritionist",
    amount: 1000.0,
    account: "Ops / Payroll",
    method: "Wire In",
    status: "failed"
  },
  {
    date: "Sep 3",
    party: "Deshaun Moore",
    amount: 244.99,
    account: "Ops / Payroll",
    method: "Wire In",
    status: null
  },
  {
    date: "Sep 3",
    party: "Jordi O'Donnell",
    amount: -2200.67,
    account: "AP",
    method: "Intl. Wire",
    status: null
  },
  {
    date: "Sep 3",
    party: "Contractor",
    amount: -213.11,
    account: "Ops / Payroll",
    method: "ACH Payment",
    status: null
  },
  {
    date: "Sep 3",
    party: "Stefanie Katz",
    amount: -1234.56,
    account: "AP",
    method: "Check Payment",
    status: null
  },
  {
    date: "Sep 2",
    party: "Jane Black",
    amount: -724.75,
    account: "Ops / Payroll",
    method: "Reimbursement ACH",
    status: null
  },
  {
    date: "Sep 2",
    party: "To Treasury",
    amount: -31764.1,
    account: "Ops / Payroll",
    method: "Treasury Transfer",
    status: null
  },
  {
    date: "Sep 2",
    party: "From Ops / Payroll",
    amount: 31764.1,
    account: "Treasury",
    method: "Treasury Transfer",
    status: null
  },
  {
    date: "Sep 2",
    party: "To Acme Savings ••7658",
    amount: -55810.16,
    account: "AR",
    method: "Transfer",
    status: null
  },
  {
    date: "Sep 2",
    party: "From AR",
    amount: 55810.16,
    account: "Savings ••7658",
    method: "Transfer",
    status: null
  },
  {
    date: "Sep 2",
    party: "Domestic Ads",
    amount: -300.03,
    account: "Ops / Payroll",
    method: "ACH Payment",
    status: null
  },
  {
    date: "Sep 2",
    party: "Milgram Brokerage",
    amount: -317.85,
    account: "Credit account",
    method: "Jane B. ••3054",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Lily's Eatery",
    amount: -54.13,
    account: "Credit account",
    method: "Jane B. ••5555",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Milgram Brokerage",
    amount: -128.96,
    account: "Ops / Payroll",
    method: "Jane B. ••3745",
    status: null
  },
  {
    date: "Sep 2",
    party: "Trader John's",
    amount: 454.05,
    account: "Ops / Payroll",
    method: "Alice C. ••6231",
    status: null
  },
  {
    date: "Sep 2",
    party: "Google",
    amount: 1043.14,
    account: "Credit account",
    method: "Jessica A. ••4039",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Google",
    amount: 3225.67,
    account: "Ops / Payroll",
    method: "Jessica A. ••4000",
    status: null
  },
  {
    date: "Sep 2",
    party: "Deli 77",
    amount: 414.07,
    account: "Credit account",
    method: "Mary M. ••0332",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Milgram Brokerage",
    amount: 1448.76,
    account: "Credit account",
    method: "Jane B. ••3054",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Orange, Inc.",
    amount: 1753.72,
    account: "Ops / Payroll",
    method: "Jane B. ••4928",
    status: null
  },
  {
    date: "Sep 2",
    party: "Lily's Eatery",
    amount: -38.73,
    account: "Ops / Payroll",
    method: "Alice C. ••1234",
    status: null
  },
  {
    date: "Sep 2",
    party: "The Plant Organic Cafe",
    amount: 100.59,
    account: "Credit account",
    method: "Sally P. ••4192",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Google",
    amount: -293.72,
    account: "Ops / Payroll",
    method: "Jessica A. ••4000",
    status: null
  },
  {
    date: "Sep 2",
    party: "Orange, Inc.",
    amount: -2095.43,
    account: "Credit account",
    method: "Carry B. ••7821",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Office Stop Co.",
    amount: 82.9,
    account: "Credit account",
    method: "Jane B. ••0330",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Orange, Inc.",
    amount: 781.94,
    account: "Credit account",
    method: "Carry B. ••7821",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Monarch Books",
    amount: -1343.88,
    account: "Ops / Payroll",
    method: "Alice C. ••7840",
    status: null
  },
  {
    date: "Sep 2",
    party: "Office Stop Co.",
    amount: -607.32,
    account: "Credit account",
    method: "Jane B. ••0330",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Lily's Eatery",
    amount: 35.55,
    account: "Ops / Payroll",
    method: "Alice C. ••1234",
    status: null
  },
  {
    date: "Sep 2",
    party: "Trader John's",
    amount: 345.36,
    account: "Credit account",
    method: "Landon S. ••0331",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Orange, Inc.",
    amount: -1432.77,
    account: "Ops / Payroll",
    method: "Jane B. ••4928",
    status: null
  },
  {
    date: "Sep 2",
    party: "Deli 77",
    amount: 589.71,
    account: "Ops / Payroll",
    method: "Jane B. ••6112",
    status: null
  },
  {
    date: "Sep 2",
    party: "The Plant Organic Cafe",
    amount: -161.91,
    account: "Credit account",
    method: "Sally P. ••4192",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Lily's Eatery",
    amount: 49.73,
    account: "Credit account",
    method: "Jane B. ••5555",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Deli 77",
    amount: -409.53,
    account: "Credit account",
    method: "Mary M. ••0332",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Trader John's",
    amount: -601.08,
    account: "Credit account",
    method: "Landon S. ••0331",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "The Plant Organic Cafe",
    amount: -235.92,
    account: "Ops / Payroll",
    method: "Landon S. ••4929",
    status: null
  },
  {
    date: "Sep 2",
    party: "Monarch Books",
    amount: -803.5,
    account: "Credit account",
    method: "Landon S. ••5555",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Deli 77",
    amount: -772.23,
    account: "Ops / Payroll",
    method: "Jane B. ••6112",
    status: null
  },
  {
    date: "Sep 2",
    party: "Milgram Brokerage",
    amount: 198.57,
    account: "Ops / Payroll",
    method: "Jane B. ••3745",
    status: null
  },
  {
    date: "Sep 2",
    party: "The Plant Organic Cafe",
    amount: 378.36,
    account: "Ops / Payroll",
    method: "Landon S. ••4929",
    status: null
  },
  {
    date: "Sep 2",
    party: "Google",
    amount: -2696.27,
    account: "Credit account",
    method: "Jessica A. ••4039",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Office Stop Co.",
    amount: 699.04,
    account: "Ops / Payroll",
    method: "Jessica A. ••9914",
    status: null
  },
  {
    date: "Sep 2",
    party: "Monarch Books",
    amount: 587.98,
    account: "Ops / Payroll",
    method: "Alice C. ••7840",
    status: null
  },
  {
    date: "Sep 2",
    party: "Monarch Books",
    amount: 1493.47,
    account: "Credit account",
    method: "Landon S. ••5555",
    status: "failed"
  },
  {
    date: "Sep 2",
    party: "Trader John's",
    amount: -383.1,
    account: "Ops / Payroll",
    method: "Alice C. ••6231",
    status: null
  }
];
