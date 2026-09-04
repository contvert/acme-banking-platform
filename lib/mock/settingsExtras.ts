// Reference data for the interface.

export interface Role { role: string; description: string; type: string; status: string; }

export const ROLES: Role[] = [
  {
    role: "Admin",
    description: "Full control including policies, accounts, and settings",
    type: "System",
    status: "Active"
  },
  {
    role: "Employee",
    description: "Can be issued cards, but cannot view sensitive bank account info",
    type: "System",
    status: "Active"
  },
  {
    role: "Accountant",
    description: "Can view all accounts and transactions, and manage books",
    type: "Custom",
    status: "Active"
  },
  {
    role: "Finance Lead",
    description: "Full non-admin access to accounts, payments, cards, and users",
    type: "Custom",
    status: "Active"
  },
  {
    role: "Finance Manager",
    description: "Manages bookkeeping, transaction coding, ACH processing, and ledger integrations",
    type: "Custom",
    status: "Needs review"
  },
  {
    role: "Money Mover",
    description: "Can initiate payments and transfers, and manage recipients on selected accounts",
    type: "Custom",
    status: "Active"
  },
  {
    role: "Read Only",
    description: "Can view all accounts and transactions, and be issued cards",
    type: "Custom",
    status: "Active"
  }
];

export const CATEGORIES: string[] = [
  "Business Client Meals",
  "Legal Fees",
  "Travel - Flights",
  "Travel - Accommodation",
  "Travel - Vehicles",
  "Contractor Payments",
  "Venue Rental",
  "Employee Gifts",
  "Lunch Perks",
  "Office Supplies",
  "Software",
  "Investments"
];

