// Reference values for the payment flow.

export interface PayeeSuggestion {
  name: string;
  initials: string;
  role: string | null;
  email: string | null;
}

export const RECENTLY_PAID: PayeeSuggestion[] = [];

/** Deposit methods, in the order and wording the reference uses. */
export interface FundingMethod {
  name: string;
  pill: string | null;
  hint: string;
  icon: string;
}

export const FUNDING_METHODS: FundingMethod[] = [
  { name: 'Wire Transfer', pill: 'Fastest', hint: 'Arrives in 1-2 business days.', icon: 'arrow-right-to-line' },
  { name: 'Bank Transfer', pill: 'Most common', hint: 'Arrives in 2-4 business days.', icon: 'arrow-right-arrow-left' },
  { name: 'Check Deposit', pill: null, hint: 'Appears in 1 to 5 business days.', icon: 'money-check' },
  { name: 'Invoice', pill: null, hint: 'Request payment from a customer.', icon: 'envelope-open-dollar' },
  { name: 'SAFE Investment', pill: null, hint: 'Accept an investment into your account.', icon: 'file-contract' },
];

export const WIRE_DETAILS = { routingNumber: '', accountSuffix: '' };

/** Spend-control options behind the Create a card select. */
export const CARD_CONTROL_TYPES = [
  'No limit',
  'Monthly limit',
  'Weekly limit',
  'Daily limit',
  'Per-transaction limit',
  'Total limit',
];
