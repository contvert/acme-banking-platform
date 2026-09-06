// Reference data for the interface.

export interface ScheduleRow { date: string; payment: number | null; endingBalance: number | null; }
export interface ActivityRow { date: string; description: string; account: string; amount: number | null; }
export const LOAN = { outstanding: 0, paymentsLeft: 0 };

export const SCHEDULE: ScheduleRow[] = [];

export const LOAN_ACTIVITY: ActivityRow[] = [];

