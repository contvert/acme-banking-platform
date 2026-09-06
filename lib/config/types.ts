/** Shape of the application configuration edited by the admin panel. */

export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF';

export const CURRENCIES: { code: Currency; symbol: string; locale: string; label: string }[] = [
  { code: 'EUR', symbol: '€', locale: 'fr-FR', label: 'Euro' },
  { code: 'USD', symbol: '$', locale: 'en-US', label: 'US dollar' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', label: 'Pound sterling' },
  { code: 'CHF', symbol: 'CHF', locale: 'de-CH', label: 'Swiss franc' },
];

export type AccountKind = 'checking' | 'savings' | 'credit' | 'treasury';
export type AccountStatus = 'active' | 'restricted' | 'closed';

export interface AccountConfig {
  id: string;
  name: string;
  kind: AccountKind;
  last4: string;
  /** Ledger balance shown as the headline figure. */
  balance: number;
  /** What can actually be spent right now. */
  available: number;
  /** Authorised but not yet settled. */
  pending: number;
  currency: Currency;
  status: AccountStatus;
}

export type CardStatus = 'active' | 'frozen' | 'suspended' | 'cancelled';

export interface CardConfig {
  id: string;
  holder: string;
  last4: string;
  label: string;
  type: 'virtual' | 'physical';
  accountId: string;
  status: CardStatus;
  spentThisMonth: number;
  /** A disabled card is not usable at all, whatever its status label says. */
  enabled: boolean;
}

export interface TransactionConfig {
  id: string;
  date: string;
  party: string;
  /** Negative is money out. */
  amount: number;
  accountId: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface NotificationConfig {
  id: string;
  title: string;
  body: string;
  level: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  author: string;
  body: string;
  at: string;
  /** Distinguishes the operator's own messages in the thread. */
  fromTeam: boolean;
}

/** A company bank account, as printed on an invoice or shared for incoming payments. */
export interface BankDetail {
  id: string;
  /** What the operator calls it internally. */
  label: string;
  /** Account holder as it appears at the bank. */
  holder: string;
  iban: string;
  bic: string;
  bankName: string;
  bankAddress: string;
  currency: Currency;
  /** The one shown by default wherever a single account is needed. */
  primary: boolean;
}

/** Bank details for a beneficiary a client can transfer money to. */
export interface RecipientConfig {
  id: string;
  /** Keeps every saved beneficiary private to the client who created it. */
  ownerUserId: string;
  /** Account holder as it appears on the beneficiary's bank account. */
  name: string;
  iban: string;
  bic: string;
  bankName: string;
  currency: Currency;
  /** A beneficiary cannot be used for a transfer until the email OTP succeeds. */
  verificationStatus: 'pending' | 'verified';
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  tagline: string;
  plan: string;
  email: string;
  phone: string;
  address: string[];
}

/** Which dashboard blocks are rendered. */
export interface SectionFlags {
  balanceChart: boolean;
  accounts: boolean;
  creditCard: boolean;
  billPay: boolean;
  invoicing: boolean;
  moneyMovement: boolean;
  transactions: boolean;
  notifications: boolean;
  chat: boolean;
}

export interface AppConfig {
  version: number;
  company: CompanyInfo;
  defaultCurrency: Currency;
  accounts: AccountConfig[];
  cards: CardConfig[];
  transactions: TransactionConfig[];
  notifications: NotificationConfig[];
  chat: ChatMessage[];
  bankDetails: BankDetail[];
  recipients: RecipientConfig[];
  sections: SectionFlags;
}

/** Collections the admin API can create/update/delete items in. */
export const COLLECTIONS = [
  'accounts', 'cards', 'transactions', 'notifications', 'chat', 'bankDetails',
] as const;
export type CollectionName = (typeof COLLECTIONS)[number];
