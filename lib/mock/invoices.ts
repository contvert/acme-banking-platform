// Reference data for the interface.

export interface Invoice { dueDate: string; status: string; customer: string; email: string | null; amount: number | null; invoiceNo: string; invoiceDate: string; type: string; }
export const INVOICE_SUMMARY = { open: 86300, openInvoices: 12, openLinks: 1, overdue: 39000, overdueInvoices: 3, paid: 75000, paidInvoices: 18, paidLinks: 1 };

export const INVOICES: Invoice[] = [
  {
    dueDate: "Jul 30 1 month ago",
    status: "Overdue",
    customer: "Aphelion Financial Advisors",
    email: "billing@aphelionfa.com",
    amount: 16500.0,
    invoiceNo: "INV-0007",
    invoiceDate: "Jun 30",
    type: "One time"
  },
  {
    dueDate: "Aug 9 25 days ago",
    status: "Overdue",
    customer: "Solstice Marketing Group",
    email: "ap@solsticemarketing.com",
    amount: 15000.0,
    invoiceNo: "INV-0008",
    invoiceDate: "Jul 10",
    type: "One time"
  },
  {
    dueDate: "Aug 14 20 days ago",
    status: "Overdue",
    customer: "Polaris Legal Services",
    email: "billing@polarislegal.com",
    amount: 7500.0,
    invoiceNo: "INV-0006",
    invoiceDate: "Jul 15",
    type: "One time"
  },
  {
    dueDate: "Oct 3 in 1 month",
    status: "Scheduled",
    customer: "Orbital Advisory Partners",
    email: "invoices@orbitaladvisory.com",
    amount: 7500.0,
    invoiceNo: "INV-0013",
    invoiceDate: "Sep 3",
    type: "One time"
  },
  {
    dueDate: "Oct 3 in 1 month",
    status: "Scheduled",
    customer: "Quasar Design Studio",
    email: "hello@quasardesign.co",
    amount: 12000.0,
    invoiceNo: "INV-0014",
    invoiceDate: "Sep 3",
    type: "One time"
  },
  {
    dueDate: "Aug 31 3 days ago",
    status: "Active",
    customer: "Meridian Consulting",
    email: "invoices@meridianconsulting.co",
    amount: 2000.0,
    invoiceNo: "INV-0025",
    invoiceDate: "Aug 1",
    type: "Monthly Next on Oct 1"
  },
  {
    dueDate: "Aug 31 3 days ago",
    status: "Active",
    customer: "Nebula Strategy Group",
    email: "ap@nebulastrategy.co",
    amount: 7500.0,
    invoiceNo: "INV-0018",
    invoiceDate: "Aug 1",
    type: "Monthly Next on Oct 1"
  },
  {
    dueDate: "Sep 28 in 25 days",
    status: "Active",
    customer: "Nebula Strategy Group",
    email: "ap@nebulastrategy.co",
    amount: 7500.0,
    invoiceNo: "INV-0009",
    invoiceDate: "Aug 29",
    type: "One time"
  },
  {
    dueDate: "Sep 30 in 27 days",
    status: "Active",
    customer: "Astral Creative Co",
    email: "finance@astralcreative.co",
    amount: 10000.0,
    invoiceNo: "INV-0010",
    invoiceDate: "Aug 31",
    type: "One time"
  },
  {
    dueDate: "Oct 1 in 28 days",
    status: "Active",
    customer: "Vega Compliance Partners",
    email: "ap@vegacompliance.com",
    amount: 5000.0,
    invoiceNo: "INV-0011",
    invoiceDate: "Sep 1",
    type: "One time"
  },
  {
    dueDate: "-",
    status: "Active",
    customer: "Astral Creative Co",
    email: "finance@astralcreative.co",
    amount: 2500.0,
    invoiceNo: "-",
    invoiceDate: "-",
    type: "Payment link"
  },
  {
    dueDate: "Oct 2 in 29 days",
    status: "Active",
    customer: "Meridian Consulting",
    email: "invoices@meridianconsulting.co",
    amount: 2000.0,
    invoiceNo: "INV-0012",
    invoiceDate: "Sep 2",
    type: "One time"
  },
  {
    dueDate: "Oct 3 in 1 month",
    status: "Active",
    customer: "Orbital Advisory Partners",
    email: "invoices@orbitaladvisory.com",
    amount: 5000.0,
    invoiceNo: "INV-0033",
    invoiceDate: "Sep 3",
    type: "Quarterly Next on Dec 1"
  },
  {
    dueDate: "Sep 23 in 20 days",
    status: "Processing",
    customer: "Polaris Legal Services",
    email: "billing@polarislegal.com",
    amount: 5000.0,
    invoiceNo: "INV-0015",
    invoiceDate: "Aug 24",
    type: "One time"
  },
  {
    dueDate: "Sep 29 in 26 days",
    status: "Processing",
    customer: "Aphelion Financial Advisors",
    email: "billing@aphelionfa.com",
    amount: 750.0,
    invoiceNo: "INV-0020",
    invoiceDate: "Aug 30",
    type: "One time"
  },
  {
    dueDate: "-",
    status: "Paid",
    customer: "Solstice Marketing Group",
    email: "ap@solsticemarketing.com",
    amount: 1000.0,
    invoiceNo: "-",
    invoiceDate: "-",
    type: "Payment link"
  },
  {
    dueDate: "Aug 31",
    status: "Paid",
    customer: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    amount: 3500.0,
    invoiceNo: "INV-0030",
    invoiceDate: "Aug 1",
    type: "Monthly Series complete"
  },
  {
    dueDate: "Aug 24",
    status: "Paid",
    customer: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    amount: 3000.0,
    invoiceNo: "INV-0004",
    invoiceDate: "Jul 25",
    type: "One time"
  },
  {
    dueDate: "Aug 19",
    status: "Paid",
    customer: "Nebula Strategy Group",
    email: "ap@nebulastrategy.co",
    amount: 7500.0,
    invoiceNo: "INV-0001",
    invoiceDate: "Jul 20",
    type: "One time"
  },
  {
    dueDate: "Aug 4",
    status: "Paid",
    customer: "Orbital Advisory Partners",
    email: "invoices@orbitaladvisory.com",
    amount: 5000.0,
    invoiceNo: "INV-0002",
    invoiceDate: "Jul 5",
    type: "One time"
  },
  {
    dueDate: "Jul 31",
    status: "Paid",
    customer: "Meridian Consulting",
    email: "invoices@meridianconsulting.co",
    amount: 2000.0,
    invoiceNo: "INV-0024",
    invoiceDate: "Jul 1",
    type: "Monthly Next on Oct 1"
  },
  {
    dueDate: "Jul 31",
    status: "Paid",
    customer: "Nebula Strategy Group",
    email: "ap@nebulastrategy.co",
    amount: 7500.0,
    invoiceNo: "INV-0017",
    invoiceDate: "Jul 1",
    type: "Monthly Next on Oct 1"
  },
  {
    dueDate: "Jul 31",
    status: "Paid",
    customer: "Solstice Marketing Group",
    email: "ap@solsticemarketing.com",
    amount: 2000.0,
    invoiceNo: "INV-0032",
    invoiceDate: "Jul 1",
    type: "Monthly Series canceled"
  },
  {
    dueDate: "Jul 31",
    status: "Paid",
    customer: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    amount: 3500.0,
    invoiceNo: "INV-0029",
    invoiceDate: "Jul 1",
    type: "Monthly Series complete"
  },
  {
    dueDate: "Jul 20",
    status: "Paid",
    customer: "Quasar Design Studio",
    email: "hello@quasardesign.co",
    amount: 8500.0,
    invoiceNo: "INV-0005",
    invoiceDate: "Jun 20",
    type: "One time"
  },
  {
    dueDate: "Jul 5",
    status: "Paid",
    customer: "Meridian Consulting",
    email: "invoices@meridianconsulting.co",
    amount: 3500.0,
    invoiceNo: "INV-0003",
    invoiceDate: "Jun 5",
    type: "One time"
  },
  {
    dueDate: "Jul 1",
    status: "Paid",
    customer: "Meridian Consulting",
    email: "invoices@meridianconsulting.co",
    amount: 2000.0,
    invoiceNo: "INV-0023",
    invoiceDate: "Jun 1",
    type: "Monthly Next on Oct 1"
  },
  {
    dueDate: "Jul 1",
    status: "Paid",
    customer: "Orbital Advisory Partners",
    email: "invoices@orbitaladvisory.com",
    amount: 5000.0,
    invoiceNo: "INV-0022",
    invoiceDate: "Jun 1",
    type: "Quarterly Next on Dec 1"
  },
  {
    dueDate: "Jul 1",
    status: "Paid",
    customer: "Solstice Marketing Group",
    email: "ap@solsticemarketing.com",
    amount: 2000.0,
    invoiceNo: "INV-0031",
    invoiceDate: "Jun 1",
    type: "Monthly Series canceled"
  },
  {
    dueDate: "Jul 1",
    status: "Paid",
    customer: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    amount: 3500.0,
    invoiceNo: "INV-0028",
    invoiceDate: "Jun 1",
    type: "Monthly Series complete"
  },
  {
    dueDate: "May 31",
    status: "Paid",
    customer: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    amount: 3500.0,
    invoiceNo: "INV-0027",
    invoiceDate: "May 1",
    type: "Monthly Series complete"
  },
  {
    dueDate: "May 1",
    status: "Paid",
    customer: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    amount: 3500.0,
    invoiceNo: "INV-0026",
    invoiceDate: "Apr 1",
    type: "Monthly Series complete"
  },
  {
    dueDate: "Mar 31",
    status: "Paid",
    customer: "Orbital Advisory Partners",
    email: "invoices@orbitaladvisory.com",
    amount: 5000.0,
    invoiceNo: "INV-0021",
    invoiceDate: "Mar 1",
    type: "Quarterly Next on Dec 1"
  },
  {
    dueDate: "Mar 31",
    status: "Paid",
    customer: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    amount: 3500.0,
    invoiceNo: "INV-0025",
    invoiceDate: "Mar 1",
    type: "Monthly Series complete"
  }
];

