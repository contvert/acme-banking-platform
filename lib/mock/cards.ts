export interface Card { holder: string | null; last4: string; label: string | null; spentThisMonth: number | null; type: string; account: string; status: 'active' | 'suspended' | 'frozen'; budgets: number; }

// Reference data for the interface.
export const CARDS: Card[] = [];
