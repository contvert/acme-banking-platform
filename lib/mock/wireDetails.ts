// Reference values for the wire-details flow.
// The reference labels these as example values and so does the page that renders them.

import { BRAND } from '@/lib/brand';

export interface DetailRow {
  label: string;
  /** Multiple lines render stacked, as addresses do on the original. */
  value: string[];
  /** Renders an info affordance next to the label. */
  info?: boolean;
}

export interface DetailGroup {
  title: string;
  /** MT103 field reference, shown in grey under the group title. */
  section?: string;
  rows: DetailRow[];
}

export interface WireSection {
  id: string;
  title: string;
  intro: string;
  groups: DetailGroup[];
  footnote?: string;
}

export const LEGAL_NAME = BRAND.legalName;

const BENEFICIARY_ADDRESS = ['2261 Market St, Suite 86807', 'San Francisco, CA 94114'];
const BANK_ADDRESS = ['1 Letterman Drive, Building A, Suite A4-700', 'San Francisco, CA 94129'];

export const WIRE_SECTIONS: WireSection[] = [
  {
    id: 'domestic',
    title: 'Domestic transfer details',
    intro: `Use these details to send domestic wires, ACH transfers, and real-time payments to ${LEGAL_NAME}’s account.`,
    groups: [
      {
        title: 'Beneficiary',
        rows: [
          { label: 'Beneficiary Name', value: [LEGAL_NAME] },
          { label: 'Account Number', value: ['3631271038'] },
          { label: 'Type of Account', value: ['Checking'] },
          { label: 'Beneficiary Address', value: BENEFICIARY_ADDRESS },
        ],
      },
      {
        title: 'Receiving Bank Details',
        rows: [
          { label: 'ABA Routing Number', value: ['132456789'] },
          { label: 'Bank Name', value: ['Column N.A.'], info: true },
          { label: 'Bank Address', value: BANK_ADDRESS },
        ],
      },
    ],
  },
  {
    id: 'international',
    title: 'International wire details',
    intro: 'If you are filling out a wire form, please reference the section labels with MT103 field numbers in grey.',
    groups: [
      {
        title: 'Receiving/Beneficiary Bank',
        section: 'Section 57D – Account with institution',
        rows: [
          { label: 'SWIFT / BIC Code', value: ['CLNOUS66MER'] },
          { label: 'ABA Routing Number', value: ['132456789'] },
          { label: 'Bank Name', value: ['Column N.A.'] },
          { label: 'Bank Address', value: [...BANK_ADDRESS, 'United States'] },
        ],
      },
      {
        title: 'Intermediary Bank',
        section: 'Section 56 – Intermediary institution',
        rows: [
          { label: 'SWIFT / BIC Code', value: ['CHASUS33XXX'], info: true },
        ],
      },
      {
        title: 'Beneficiary',
        section: 'Section 59 – Recipient',
        rows: [
          { label: 'IBAN / Account Number', value: ['3631271038'] },
          { label: 'Beneficiary Name', value: [LEGAL_NAME] },
          { label: 'Beneficiary Address', value: [...BENEFICIARY_ADDRESS, 'United States'] },
        ],
      },
    ],
    footnote:
      'Make sure to provide the beneficiary’s address details to avoid potential delays or rejections.',
  },
];

export const WIRE_DISCLAIMER =
  'The details shown here are only an example. Please visit your own, real dashboard to see the wire details for your account.';

export const WIRE_STEPS = [
  { label: 'Choose method', href: '/add-funds' },
  { label: 'Payment details', href: '/add-funds/wire' },
];
