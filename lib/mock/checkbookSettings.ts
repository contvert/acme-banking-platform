// Reference data for the interface.

export interface Checkbook { ordered: string; nickname: string; account: string; range: string; }
export const CHECK_REVIEW = {
  note: 'When someone deposits a check from your account, you have about 24 hours to approve or reject it. After that, your default action applies automatically.',
  defaultAction: 'Approve check',
};
export const CHECK_ACCOUNTS: { name: string; detail: string; balance: number }[] = [];

export const CHECKBOOKS: Checkbook[] = [];

