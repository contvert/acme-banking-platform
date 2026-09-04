// Reference data for the interface.

export interface Bill { dueDate: string; status: string; recipient: string; amount: number | null; invoiceNo: string; lastUpdated: string; }
export const BILL_SUMMARY = { outstanding: 7, outstandingAmount: 22272.18, overdue: 3, overdueAmount: 13110, dueSoon: 0, dueSoonAmount: 0 };
export const BILL_TABS = [{ label: 'Inbox', count: 3 }, { label: 'Needs Approval', count: 1 }, { label: 'Scheduled', count: 3 }, { label: 'Paid', count: null }];
export const AP_EMAIL = 'accounts-payable@acme.example';

export const BILLS: Bill[] = [
  {
    dueDate: "Apr 2025",
    status: "Overdue",
    recipient: "Debug LLC",
    amount: 220.0,
    invoiceNo: "INV-902",
    lastUpdated: "Sep 3"
  },
  {
    dueDate: "Dec 2025",
    status: "Overdue",
    recipient: "Nano Tech LLC",
    amount: 1290.0,
    invoiceNo: "INV-001",
    lastUpdated: "Sep 3"
  },
  {
    dueDate: "Jan 17",
    status: "Overdue",
    recipient: "Tax Bureau Inc",
    amount: 11600.0,
    invoiceNo: "INV-883346",
    lastUpdated: "Sep 3"
  }
];

