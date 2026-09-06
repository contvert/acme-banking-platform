export interface Transaction { date: string; party: string; amount: number | null; account: string; method: string; status: string | null; }

// Reference data for the interface.
export const TRANSACTIONS: Transaction[] = [];
