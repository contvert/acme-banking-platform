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
  legalName: '',
  dba: '',
  ein: '•••••••••',
  phone: '',
};
export const APPROVAL_RULES = [
  { scope: 'Per-payment', rule: 'If amount is less than $100.00', approver: 'Any admin' },
  { scope: 'Daily maximum', rule: 'If daily total exceeds the configured limit', approver: 'Any admin' },
  { scope: 'Dual admin', rule: 'Sensitive settings changes', approver: 'Two admins' },
];

export const STATEMENTS: Statement[] = [];

export const API_TOKENS: ApiToken[] = [];

export const WEBHOOKS: Webhook[] = [];

export const CONNECTED_INTEGRATIONS: Integration[] = [];

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
    name: "Mercury MCP",
    description: "Model Context Protocol server to connect LLM clients with Mercury.",
    category: "Other"
  }
];

