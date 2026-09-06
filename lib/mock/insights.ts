// Reference data for the interface.

export interface FlowRow { name: string; pct: number; amount: number | null; }
export const INSIGHTS_SUMMARY = { range: '', netCashflow: 0, moneyIn: 0, moneyOut: 0 };
export const INSIGHTS_NARRATIVE = {
  runway: '',
  moneyOut: '',
  moneyIn: '',
};

export const TOP_SOURCES: FlowRow[] = [];

export const TOP_RECIPIENTS: FlowRow[] = [];

