// Reference data for the interface.

export interface TaxAlert { text: string; action: string; }
export interface TaxFiler { name: string; w9: string; nec: string; misc: string; }
export const TAX_YEAR = 2026;
export const IRS_DEADLINE = '2/2/27';

export const TAX_ALERTS: TaxAlert[] = [];

export const TAX_FILERS: TaxFiler[] = [];

