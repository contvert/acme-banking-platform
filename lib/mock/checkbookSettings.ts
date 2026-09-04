// Reference data for the interface.

export interface Checkbook { ordered: string; nickname: string; account: string; range: string; }
export const CHECK_REVIEW = {
  note: 'When someone deposits a check from your account, you have about 24 hours to approve or reject it. After that, your default action applies automatically.',
  defaultAction: 'Approve check',
};
export const CHECK_ACCOUNTS = [
  { name: 'AR', detail: 'Checking ••4311', balance: 0 },
  { name: 'Ops / Payroll', detail: 'Checking ••1038', balance: 2023267.12 },
];

export const CHECKBOOKS: Checkbook[] = [
  {
    ordered: "Jun 15",
    nickname: "Main Office",
    account: "Ops / Payroll",
    range: "1001 - 1100"
  },
  {
    ordered: "Sep 20",
    nickname: "Branch Office",
    account: "Ops / Payroll",
    range: "1101 - 1200"
  }
];

