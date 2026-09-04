// Reference data for the interface.

export interface Budget { name: string; limit: number | null; cycle: string | null; spentPct: number; assignedExtra: number; upcoming: boolean; }
export const SPEND_SUMMARY = { total: 4593.84, period: 'Last 30 days', categories: ['Hardware', 'Team Lunch', 'Software Subscriptions', 'Other'] };
export const REVIEW_REQUIRED = { expenses: 5, receiptExceptions: 1 };

export const BUDGETS: Budget[] = [
  {
    name: "Team Lunch",
    limit: 200.0,
    cycle: "weekly",
    spentPct: 19,
    assignedExtra: 16,
    upcoming: false
  },
  {
    name: "Hardware",
    limit: 1000.0,
    cycle: "monthly",
    spentPct: 49,
    assignedExtra: 3,
    upcoming: false
  },
  {
    name: "Learning & Development",
    limit: 300.0,
    cycle: "monthly",
    spentPct: 13,
    assignedExtra: 4,
    upcoming: false
  },
  {
    name: "Software Subscriptions",
    limit: 250.0,
    cycle: "monthly",
    spentPct: 25,
    assignedExtra: 5,
    upcoming: false
  },
  {
    name: "Q3 Company Offsite",
    limit: 12000.0,
    cycle: "once",
    spentPct: 0,
    assignedExtra: 3,
    upcoming: true
  }
];

