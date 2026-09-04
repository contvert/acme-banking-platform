/** IBAN helpers: formatting and the ISO 13616 / ISO 7064 mod-97 check. */

/** Expected total length per country, for the codes a European reference is likely to use. */
const LENGTHS: Record<string, number> = {
  AD: 24, AT: 20, BE: 16, BG: 22, CH: 21, CY: 28, CZ: 24, DE: 22, DK: 18, EE: 20,
  ES: 24, FI: 18, FR: 27, GB: 22, GI: 23, GR: 27, HR: 21, HU: 28, IE: 22, IS: 26,
  IT: 27, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MT: 31, NL: 18, NO: 15, PL: 28,
  PT: 25, RO: 24, SE: 24, SI: 19, SK: 24, SM: 27,
};

export const normaliseIban = (value: string) => value.replace(/\s+/g, '').toUpperCase();

/** Groups of four, the way an IBAN is written on paper. */
export const formatIban = (value: string) =>
  normaliseIban(value).replace(/(.{4})/g, '$1 ').trim();

export interface IbanCheck {
  valid: boolean;
  reason?: string;
  country?: string;
}

export function checkIban(input: string): IbanCheck {
  const iban = normaliseIban(input);
  if (!iban) return { valid: false, reason: 'IBAN vide' };
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
    return { valid: false, reason: 'Format attendu : 2 lettres, 2 chiffres, puis alphanumérique' };
  }

  const country = iban.slice(0, 2);
  const expected = LENGTHS[country];
  if (expected && iban.length !== expected) {
    return { valid: false, reason: `Un IBAN ${country} fait ${expected} caractères (reçu ${iban.length})`, country };
  }

  // Move the first four characters to the end, map letters to numbers, mod 97.
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));

  let remainder = 0;
  for (const d of digits) {
    remainder = (remainder * 10 + Number(d)) % 97;
  }

  return remainder === 1
    ? { valid: true, country }
    : { valid: false, reason: 'Clé de contrôle invalide', country };
}

/** BIC / SWIFT: 8 or 11 characters. */
export function checkBic(input: string): IbanCheck {
  const bic = normaliseIban(input);
  if (!bic) return { valid: true };
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic)
    ? { valid: true }
    : { valid: false, reason: 'BIC attendu : 8 ou 11 caractères' };
}
