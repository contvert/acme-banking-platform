// Reference data for the interface.

export interface Budget { name: string; limit: number | null; cycle: string | null; spentPct: number; assignedExtra: number; upcoming: boolean; }
export const SPEND_SUMMARY = { total: 0, period: 'Last 30 days', categories: [] as string[] };
export const REVIEW_REQUIRED = { expenses: 0, receiptExceptions: 0 };

export const BUDGETS: Budget[] = [];

