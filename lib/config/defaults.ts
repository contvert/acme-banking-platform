import { BRAND } from '@/lib/brand';
import type { AppConfig } from './types';

/**
 * The state a fresh install starts from: one account, no history.
 * Everything else is added through the admin panel.
 */
export const DEFAULT_CONFIG: AppConfig = {
  version: 1,
  company: {
    name: BRAND.name,
    legalName: BRAND.legalName,
    tagline: BRAND.tagline,
    plan: BRAND.plan,
    email: `hello@${BRAND.emailDomain}`,
    phone: '+33 1 00 00 00 00',
    address: ['1 rue de la Banque', '75001 Paris', 'France'],
  },
  defaultCurrency: 'EUR',
  accounts: [
    {
      id: 'acc-main',
      name: 'Compte principal',
      kind: 'checking',
      last4: '1038',
      balance: 450_000,
      available: 450_000,
      pending: 0,
      currency: 'EUR',
      status: 'active',
    },
  ],
  cards: [],
  transactions: [],
  notifications: [],
  chat: [],
  bankDetails: [
    {
      id: 'rib-main',
      label: 'Compte principal',
      holder: BRAND.legalName,
      iban: 'FR7630006000011234567890189',
      bic: 'AGRIFRPP',
      bankName: 'Banque Acme',
      bankAddress: '1 rue de la Banque, 75001 Paris',
      currency: 'EUR',
      primary: true,
    },
  ],
  sections: {
    balanceChart: true,
    accounts: true,
    creditCard: false,
    billPay: false,
    invoicing: false,
    moneyMovement: false,
    transactions: true,
    notifications: true,
    chat: true,
  },
};
