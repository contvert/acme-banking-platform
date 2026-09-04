// Reference data for the interface.

export interface Series { customer: string; email: string | null; seriesId: string; status: string; amount: number | null; frequency: string; nextOn: string | null; }
export interface Customer { name: string; email: string; lastPaid: string | null; }
export interface CatalogItem { item: string; description: string; unitPrice: number | null; lastUpdated: string; }

export const SERIES: Series[] = [
  {
    customer: "Meridian Consulting",
    email: "invoices@meridianconsulting.co",
    seriesId: "S-0003",
    status: "Active",
    amount: 2000.0,
    frequency: "Monthly",
    nextOn: "Oct 1"
  },
  {
    customer: "Nebula Strategy Group",
    email: "ap@nebulastrategy.co",
    seriesId: "S-0001",
    status: "Active",
    amount: 7500.0,
    frequency: "Monthly",
    nextOn: "Oct 1"
  },
  {
    customer: "Orbital Advisory Partners",
    email: "invoices@orbitaladvisory.com",
    seriesId: "S-0002",
    status: "Active",
    amount: 5000.0,
    frequency: "Quarterly",
    nextOn: "Dec 1"
  },
  {
    customer: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    seriesId: "S-0004",
    status: "Completed",
    amount: 3500.0,
    frequency: "Monthly",
    nextOn: null
  },
  {
    customer: "Solstice Marketing Group",
    email: "ap@solsticemarketing.com",
    seriesId: "S-0005",
    status: "Canceled",
    amount: 1200.0,
    frequency: "Monthly",
    nextOn: null
  }
];

export const CUSTOMERS: Customer[] = [
  {
    name: "Aphelion Financial Advisors",
    email: "billing@aphelionfa.com",
    lastPaid: "Aug 12"
  },
  {
    name: "Astral Creative Co",
    email: "finance@astralcreative.co",
    lastPaid: null
  },
  {
    name: "Meridian Consulting",
    email: "invoices@meridianconsulting.co",
    lastPaid: "Aug 29"
  },
  {
    name: "Nebula Strategy Group",
    email: "ap@nebulastrategy.co",
    lastPaid: "Aug 31"
  },
  {
    name: "Orbital Advisory Partners",
    email: "invoices@orbitaladvisory.com",
    lastPaid: "Aug 22"
  },
  {
    name: "Polaris Legal Services",
    email: "billing@polarislegal.com",
    lastPaid: "Aug 27"
  },
  {
    name: "Quasar Design Studio",
    email: "hello@quasardesign.co",
    lastPaid: "Aug 19"
  },
  {
    name: "Solstice Marketing Group",
    email: "ap@solsticemarketing.com",
    lastPaid: null
  },
  {
    name: "Vega Compliance Partners",
    email: "ap@vegacompliance.com",
    lastPaid: null
  },
  {
    name: "Zenith Capital Firm",
    email: "accounts@zenithcapital.co",
    lastPaid: "Aug 4"
  }
];

export const CATALOG: CatalogItem[] = [
  {
    item: "Advisory Retainer",
    description: "Strategic advisory services, billed monthly",
    unitPrice: 5000.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Brand Strategy Deliverable",
    description: "Comprehensive brand strategy and guidelines package",
    unitPrice: 8500.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Consulting Package - 10H",
    description: "10-hour consulting engagement block",
    unitPrice: 3500.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Contract Setup Fee",
    description: "One-time setup fee for new client onboarding",
    unitPrice: 1500.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Creative Deliverable - Custom",
    description: "Custom creative project (design, copy, video)",
    unitPrice: 4500.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Filing & Administrative Fees",
    description: "Document filing, compliance, and admin support",
    unitPrice: 750.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Monthly Retainer",
    description: "Ongoing monthly advisory retainer",
    unitPrice: 7500.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Q4 Paid Media Execution",
    description: "Full-service paid media management for Q4",
    unitPrice: 12000.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Web Design & Infrastructure",
    description: "Full website design, build, and hosting setup",
    unitPrice: 15000.0,
    lastUpdated: "Aug 29"
  },
  {
    item: "Web Maintenance",
    description: "Monthly website maintenance and security updates",
    unitPrice: 2000.0,
    lastUpdated: "Aug 29"
  }
];

