// Sidebar structure for the application.

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  children?: NavItem[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: 'house' },
  { label: 'Tasks', href: '/tasks', icon: 'clipboard-check', badge: '10' },
  { label: 'Command', href: '/command', icon: 'terminal', badge: 'New' },
  {
    label: 'Accounts', href: '/accounts', icon: 'building-columns',
    children: [
      { label: 'Treasury', href: '/accounts/treasury', icon: 'chart-line' },
      { label: 'Financing', href: '/capital', icon: 'money-bill-wave' },
    ],
  },
  {
    label: 'Transactions', href: '/transactions', icon: 'right-left',
    children: [{ label: 'Insights', href: '/insights/overview', icon: 'chart-column' }],
  },
  {
    label: 'Cards', href: '/cards', icon: 'credit-card',
    children: [{ label: 'Credit Card', href: '/accounts/credit', icon: 'credit-card' }],
  },
  {
    label: 'Team Spend', href: '/team-spend', icon: 'users',
    children: [
      { label: 'Reimbursements', href: '/expenses/all-expenses', icon: 'receipt' },
      { label: 'Policies', href: '/team-spend/policies', icon: 'shield-check' },
    ],
  },
  {
    label: 'Payments', href: '/payments', icon: 'paper-plane',
    children: [
      { label: 'Bill Pay', href: '/bill-pay', icon: 'file-invoice-dollar' },
      { label: 'Recipients', href: '/payments/recipients', icon: 'user-group-simple' },
      { label: 'Taxes', href: '/taxes', icon: 'file-contract' },
      { label: 'Wire Drawdowns', href: '/payments/wire-drawdowns', icon: 'arrow-down-to-line' },
      { label: 'ACH Authorizations', href: '/payments/authorizations', icon: 'signature' },
      { label: 'Checkbooks', href: '/checkbooks/hub', icon: 'money-check' },
    ],
  },
  {
    label: 'Invoicing', href: '/invoicing', icon: 'envelope-open-dollar',
    children: [
      { label: 'Recurring Series', href: '/invoicing/series', icon: 'repeat' },
      { label: 'Customers', href: '/invoicing/customers', icon: 'users' },
      { label: 'Catalog', href: '/invoicing/catalog', icon: 'books' },
    ],
  },
  { label: 'Accounting', href: '/accounting', icon: 'table-columns' },
];

export const QUICK_ACTIONS: NavItem[] = [
  { label: 'Send', href: '/send-money/pay/start', icon: 'paper-plane' },
  { label: 'Transfer', href: '/send-money/transfer', icon: 'arrow-right-arrow-left' },
  { label: 'Deposit', href: '/add-funds', icon: 'arrow-down-to-line' },
  { label: 'Request', href: '/invoicing/create-invoice', icon: 'envelope-open-dollar' },
  { label: 'Upload bill', href: '/bill-pay', icon: 'file-arrow-up' },
];

export const ACCOUNT_MENU: NavItem[] = [
  { label: 'All Settings', href: '/settings', icon: 'gear' },
  { label: 'Team', href: '/settings/users', icon: 'users' },
  { label: 'Documents & Data', href: '/settings/documents', icon: 'file-lines' },
  { label: 'Plan & Billing', href: '/settings/plan-and-billing', icon: 'credit-card' },
  { label: 'Referrals', href: '/settings/referrals', icon: 'gift', badge: 'Earn $250' },
  { label: 'All Accounts', href: '/panorama', icon: 'grid-2' },
];

/** Bookmarks rail at the foot of the sidebar. */
export const BOOKMARKS: NavItem[] = [
  { label: 'Ops / Payroll', href: '/accounts/depository/party-bankid2', icon: 'bookmark' },
  { label: 'Credit Card', href: '/accounts/credit', icon: 'bookmark' },
  { label: 'Bill Pay', href: '/bill-pay', icon: 'bookmark' },
  { label: 'Insights', href: '/insights/overview', icon: 'bookmark' },
];
