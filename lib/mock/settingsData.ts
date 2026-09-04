// Reference data for the interface.

export interface Statement { period: string; account: string; }
export interface ApiToken { nickname: string; permissions: string; lastUsed: string; createdBy: string; created: string; ips: string; }
export interface Webhook { url: string; status: string; events: string; created: string; }
export interface Integration { name: string; description: string; status?: string; category?: string; }
export const DEPARTMENTS = ['Executive', 'Finance', 'Accounting', 'Product', 'Design'];
export const NOTIFICATION_GROUPS = [
  { title: 'Important Updates', items: [
    { name: 'Cash flow', description: 'Tracks money going in and out', email: true, push: true },
    { name: 'Suspicious activity', description: 'Alerts you of potential fraud', email: true, push: true },
    { name: 'Tasks and approvals', description: 'Notifies you of requests', email: true, push: false },
  ] },
  { title: 'General Updates', items: [
    { name: 'Your spending', description: 'Tracks expenses, reimbursements, card limits, and transactions needing more info', email: true, push: false },
    { name: 'Account balances', description: 'Alerts you when low-balance thresholds are crossed', email: true, push: false },
  ] },
];
export const PLAN = {
  name: 'Pro', price: 350,
  groups: [
    { title: 'Powerful Banking', features: ['Business checking & savings', 'Send and receive money', 'Corporate debit & credit cards'] },
    { title: 'Finance Workflows', features: ['Unlimited bill payments', 'Unlimited invoices', '$0 per ACH debit', 'Unlimited 1099-NEC or 1099-MISC tax filings'] },
  ],
};
export const VAULT = { fdicLimit: 220_000_000, checkingSavings: 5_000_000, treasuryYield: 3.44 };
export const COMPANY = {
  legalName: 'Acme, Incorporated',
  dba: 'Acme, Incorporated',
  ein: '•••••••••',
  phone: '+1 (800) 000-0000',
};
export const APPROVAL_RULES = [
  { scope: 'Per-payment', rule: 'If amount is less than $100.00', approver: 'Any admin' },
  { scope: 'Daily maximum', rule: 'If daily total exceeds the configured limit', approver: 'Any admin' },
  { scope: 'Dual admin', rule: 'Sensitive settings changes', approver: 'Two admins' },
];

export const STATEMENTS: Statement[] = [
  {
    period: "Aug 2026",
    account: "Credit"
  },
  {
    period: "Aug 2026",
    account: "Treasury"
  },
  {
    period: "Aug 2026",
    account: "Ops / Payroll"
  },
  {
    period: "Aug 2026",
    account: "AP"
  },
  {
    period: "Aug 2026",
    account: "AR"
  },
  {
    period: "Aug 2026",
    account: "Sweep summary"
  },
  {
    period: "Jul 2026",
    account: "Credit"
  },
  {
    period: "Jul 2026",
    account: "Treasury"
  },
  {
    period: "Jul 2026",
    account: "Ops / Payroll"
  },
  {
    period: "Jul 2026",
    account: "AP"
  },
  {
    period: "Jul 2026",
    account: "AR"
  },
  {
    period: "Jul 2026",
    account: "Sweep summary"
  },
  {
    period: "Jun 2026",
    account: "Credit"
  },
  {
    period: "Jun 2026 More info",
    account: "Treasury"
  },
  {
    period: "Jun 2026 More info",
    account: "Treasury"
  },
  {
    period: "Jun 2026 More info",
    account: "Treasury"
  },
  {
    period: "Jun 2026",
    account: "Ops / Payroll"
  },
  {
    period: "Jun 2026",
    account: "AP"
  },
  {
    period: "Jun 2026",
    account: "AR"
  },
  {
    period: "Jun 2026",
    account: "Sweep summary"
  },
  {
    period: "May 2026",
    account: "Credit"
  },
  {
    period: "May 2026",
    account: "Treasury"
  },
  {
    period: "May 2026",
    account: "Ops / Payroll"
  },
  {
    period: "May 2026",
    account: "AP"
  },
  {
    period: "May 2026",
    account: "AR"
  },
  {
    period: "Apr 2026",
    account: "Credit"
  },
  {
    period: "Apr 2026",
    account: "Treasury"
  },
  {
    period: "Apr 2026",
    account: "Ops / Payroll"
  },
  {
    period: "Apr 2026",
    account: "AP"
  },
  {
    period: "Apr 2026",
    account: "AR"
  },
  {
    period: "Mar 2026",
    account: "Credit"
  },
  {
    period: "Mar 2026",
    account: "Treasury"
  },
  {
    period: "Mar 2026",
    account: "Ops / Payroll"
  },
  {
    period: "Mar 2026",
    account: "AP"
  },
  {
    period: "Mar 2026",
    account: "AR"
  },
  {
    period: "Feb 2026",
    account: "Credit"
  },
  {
    period: "Feb 2026",
    account: "Treasury"
  },
  {
    period: "Feb 2026",
    account: "Ops / Payroll"
  },
  {
    period: "Feb 2026",
    account: "AP"
  },
  {
    period: "Feb 2026",
    account: "AR"
  },
  {
    period: "Jan 2026",
    account: "Credit"
  },
  {
    period: "Jan 2026",
    account: "Treasury"
  },
  {
    period: "Jan 2026",
    account: "Ops / Payroll"
  },
  {
    period: "Jan 2026",
    account: "AP"
  },
  {
    period: "Jan 2026",
    account: "AR"
  }
];

export const API_TOKENS: ApiToken[] = [
  {
    nickname: "Token with long IPv6 address",
    permissions: "Read/Write",
    lastUsed: "May 16, 2019",
    createdBy: "jane@acme.example",
    created: "Mar 14, 2019",
    ips: "1 IP whitelisted"
  },
  {
    nickname: "My read-write Acme API token",
    permissions: "Read/Write",
    lastUsed: "Apr 15, 2019",
    createdBy: "jane@acme.example",
    created: "Mar 14, 2019",
    ips: "2 IPs whitelisted"
  },
  {
    nickname: "My read-only Acme API token",
    permissions: "Read",
    lastUsed: "Mar 14, 2019",
    createdBy: "landon@acme.example",
    created: "Mar 14, 2019",
    ips: "1 IP whitelisted"
  }
];

export const WEBHOOKS: Webhook[] = [
  {
    url: "https://api.acme.example/webhooks/acme",
    status: "Active",
    events: "3 events",
    created: "Nov 2, 2025"
  },
  {
    url: "https://hooks.acme.example/ingest",
    status: "Active",
    events: "All events",
    created: "Sep 15, 2025"
  },
  {
    url: "https://internal.corp.example/webhook-receiver",
    status: "Paused",
    events: "2 events",
    created: "Dec 1, 2025"
  },
  {
    url: "https://old-service.example/hooks",
    status: "Disabled",
    events: "1 event",
    created: "Jun 10, 2025"
  },
  {
    url: "https://payments.acme.example/events",
    status: "Active",
    events: "4 events",
    created: "Jan 20, 2026"
  },
  {
    url: "https://very-long-subdomain.enterprise-platform.example/api/v2/integrations/acme/webhook-receiver/incoming-events",
    status: "Active",
    events: "All events",
    created: "Feb 1, 2026"
  }
];

export const CONNECTED_INTEGRATIONS: Integration[] = [
  {
    name: "Gmail",
    description: "Automatically match receipts to your transactions",
    status: "Connected"
  },
  {
    name: "Zapier",
    description: "Link your automated workflows",
    status: "Connected"
  }
];

export const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    name: "NetSuite",
    description: "Categorize transactions and sync your bank feed",
    category: "Accounting"
  },
  {
    name: "QuickBooks",
    description: "Categorize transactions and sync your bank feed",
    category: "Accounting"
  },
  {
    name: "Xero",
    description: "Categorize transactions and sync your bank feed",
    category: "Accounting"
  },
  {
    name: "Payroll or HR",
    description: "Sync and invite team members",
    category: "Team Management"
  },
  {
    name: "Stripe",
    description: "Accept card payments on invoices",
    category: "Other"
  },
  {
    name: "Slack",
    description: "Configurable notifications",
    category: "Other"
  },
  {
    name: "Finicity",
    description: "Connect your accounts to financial institutions and third-party applications",
    category: "Other"
  },
  {
    name: "Plaid",
    description: "Connect your accounts to financial institutions and third-party applications",
    category: "Other"
  },
  {
    name: "Acme MCP",
    description: "Model Context Protocol server to connect LLM clients with Acme.",
    category: "Other"
  }
];

