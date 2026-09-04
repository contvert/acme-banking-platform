// Captured by walking /issue-card on the reference interface to its confirmation state
// (scraper/explore-cards.mjs, scraper/issue4.mjs).

export const RECEIPT_POLICY = {
  badge: 'Recommended',
  title: 'Require receipts for card transactions over $75',
  body:
    'Recommended because the IRS requires receipts for transactions $75 and over to be ' +
    'eligible for tax deductions. Change this setting at any time from your Policies page.',
  /** Shorter wording the confirmation screen uses for the same policy. */
  confirmationBody:
    'Recommended because the IRS requires receipts for transactions $75 and over to be ' +
    'eligible for tax deductions. Manage this and other spend policies from your Policies page.',
  policiesHref: '/team-spend/policies',
};

export const CARD_TABS = ['Manage', 'Subscriptions'] as const;

/** Options the cardholder combobox offers, scraped from its own listbox. */
export const CARDHOLDER_EXTRA = 'Invite new team member';

/** The Spend controls combobox offers exactly these two. */
export const CONTROL_TYPES = ['Existing budgets', 'Spending limit'] as const;

/** The original shows bare labels on these radios, no supporting copy. */
export const CARD_TYPE_OPTIONS = ['Credit', 'Debit'];
export const CARD_FORM_OPTIONS = ['Virtual', 'Physical'];

export const NOTE_MAX = 140;

export const CONFIRMATION = {
  title: 'You’re all set',
  lines: ['Your card is activated and ready to use.', 'Go do great things.'],
  secondary: 'Create another',
  primary: 'View card details',
};
