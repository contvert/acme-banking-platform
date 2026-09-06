// Reference data for the interface.

export interface Bill { dueDate: string; status: string; recipient: string; amount: number | null; invoiceNo: string; lastUpdated: string; }
export const BILL_SUMMARY = { outstanding: 0, outstandingAmount: 0, overdue: 0, overdueAmount: 0, dueSoon: 0, dueSoonAmount: 0 };
export const BILL_TABS = [{ label: 'Inbox', count: 0 }, { label: 'Needs Approval', count: 0 }, { label: 'Scheduled', count: 0 }, { label: 'Paid', count: null }];
export const AP_EMAIL = '';

export const BILLS: Bill[] = [];

