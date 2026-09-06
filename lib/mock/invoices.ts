// Reference data for the interface.

export interface Invoice { dueDate: string; status: string; customer: string; email: string | null; amount: number | null; invoiceNo: string; invoiceDate: string; type: string; }
export const INVOICE_SUMMARY = { open: 0, openInvoices: 0, openLinks: 0, overdue: 0, overdueInvoices: 0, paid: 0, paidInvoices: 0, paidLinks: 0 };

export const INVOICES: Invoice[] = [];
