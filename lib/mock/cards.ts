export interface Card { holder: string | null; last4: string; label: string | null; spentThisMonth: number | null; type: string; account: string; status: 'active' | 'suspended' | 'frozen'; budgets: number; }

// Reference data for the interface.
export const CARDS: Card[] = [
  {
    holder: "Jane Black",
    last4: "5555",
    label: "Jane's credit card",
    spentThisMonth: 0.0,
    type: "physical",
    account: "Credit Card",
    status: "active",
    budgets: 2
  },
  {
    holder: "Jane Black",
    last4: "0330",
    label: "AWS billing",
    spentThisMonth: 1500.0,
    type: "virtual",
    account: "Credit Card",
    status: "active",
    budgets: 1
  },
  {
    holder: "Jane Black",
    last4: "3054",
    label: "Facebook ads",
    spentThisMonth: 1500.0,
    type: "virtual",
    account: "Credit Card",
    status: "active",
    budgets: 0
  },
  {
    holder: "Jane Black",
    last4: "3745",
    label: null,
    spentThisMonth: 783.0,
    type: "physical",
    account: "Checking ••0297",
    status: "active",
    budgets: 0
  },
  {
    holder: "Jane Black",
    last4: "4928",
    label: "Grocery/Meals",
    spentThisMonth: 0.0,
    type: "virtual",
    account: "Ops / Payroll",
    status: "active",
    budgets: 0
  },
  {
    holder: "Jane Black",
    last4: "6112",
    label: "Column Card",
    spentThisMonth: 2987.0,
    type: "virtual",
    account: "Checking",
    status: "active",
    budgets: 0
  },
  {
    holder: "Jane Black",
    last4: "4471",
    label: "Team Lunch Debit Card",
    spentThisMonth: 450.0,
    type: "virtual",
    account: "Checking ••0297",
    status: "active",
    budgets: 0
  },
  {
    holder: "Jane Black",
    last4: "6871",
    label: null,
    spentThisMonth: 110.0,
    type: "physical",
    account: "Checking ••0297",
    status: "suspended",
    budgets: 0
  },
  {
    holder: "Jane Black",
    last4: "8628",
    label: "Travel expenses",
    spentThisMonth: 0.0,
    type: "virtual",
    account: "Credit Card",
    status: "suspended",
    budgets: 0
  },
  {
    holder: "Alice Chen",
    last4: "7840",
    label: null,
    spentThisMonth: 0.0,
    type: "physical",
    account: "Checking ••0297",
    status: "active",
    budgets: 0
  },
  {
    holder: "Alice Chen",
    last4: "1234",
    label: "Office Card",
    spentThisMonth: 10789.0,
    type: "virtual",
    account: "Checking ••0297",
    status: "active",
    budgets: 0
  },
  {
    holder: "Alice Chen",
    last4: "6231",
    label: null,
    spentThisMonth: 110.0,
    type: "physical",
    account: "Checking ••0297",
    status: "active",
    budgets: 0
  },
  {
    holder: "Alice Chen",
    last4: "0330",
    label: "Contractor Expenses",
    spentThisMonth: 199.0,
    type: "physical",
    account: "Credit Card",
    status: "active",
    budgets: 0
  }
];
