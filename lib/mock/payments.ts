// Reference data for the interface.

export interface Drawdown { created: string; recipient: string; limit: number | null; payFrom: string; }
export interface AchAuth { vendor: string; authorizedOn: string; account: string; limit: number | null; }
export const ACH_FLAGGED = 3;

export const DRAWDOWNS: Drawdown[] = [
  {
    created: "Sep 1",
    recipient: "Custom Entity",
    limit: 512213.22,
    payFrom: "Ops / Payroll"
  },
  {
    created: "Aug 13",
    recipient: "Trinet",
    limit: null,
    payFrom: "Ops / Payroll"
  },
  {
    created: "Aug 4",
    recipient: "Gusto",
    limit: 12213.22,
    payFrom: "Ops / Payroll"
  },
  {
    created: "Sep 3, 2023",
    recipient: "Resourcing Edge I, LLC",
    limit: 75000.0,
    payFrom: "Ops / Payroll"
  }
];

export const ACH_AUTHS: AchAuth[] = [
  {
    vendor: "Lighthouse Properties #3431",
    authorizedOn: "Sep 3, 2026",
    account: "Ops / Payroll",
    limit: 23103.46
  },
  {
    vendor: "Lighthouse Properties #3431",
    authorizedOn: "Sep 3, 2026",
    account: "AP",
    limit: null
  },
  {
    vendor: "Domestic Ads",
    authorizedOn: "Sep 3, 2026",
    account: "Ops / Payroll",
    limit: 20000.0
  }
];

