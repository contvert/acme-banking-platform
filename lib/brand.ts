/**
 * Single source of truth for brand identity.
 *
 * `Acme` is a deliberate placeholder — swap these values for the real brand and
 * nothing else needs to change. `emailDomain` uses the reserved `.example` TLD
 * (RFC 2606) so placeholder addresses can never reach a real inbox.
 */
export const BRAND = {
  name: 'Acme',
  productName: 'Acme',
  legalName: 'Acme, Incorporated',
  tagline: 'Business banking',
  plan: 'Pro',
  /** Two-letter mark printed on the card face. */
  cardMark: 'AC',
  emailDomain: 'acme.example',
} as const;
