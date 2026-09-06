/**
 * Single source of truth for brand identity.
 *
 * `Mercury` is a deliberate placeholder — swap these values for the real brand and
 * nothing else needs to change. `emailDomain` uses the reserved `.example` TLD
 * (RFC 2606) so placeholder addresses can never reach a real inbox.
 */
export const BRAND = {
  name: 'Mercury',
  productName: 'Mercury',
  legalName: 'Mercury, Incorporated',
  tagline: 'Business banking',
  plan: 'Pro',
  /** Two-letter mark printed on the card face. */
  cardMark: 'AC',
  emailDomain: 'mercury.example',
} as const;
