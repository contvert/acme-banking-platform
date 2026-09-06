// Reference data for the interface.

export interface Series { customer: string; email: string | null; seriesId: string; status: string; amount: number | null; frequency: string; nextOn: string | null; }
export interface Customer { name: string; email: string; lastPaid: string | null; }
export interface CatalogItem { item: string; description: string; unitPrice: number | null; lastUpdated: string; }

export const SERIES: Series[] = [];

export const CUSTOMERS: Customer[] = [];

export const CATALOG: CatalogItem[] = [];

