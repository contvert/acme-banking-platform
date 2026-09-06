// Reference data for the interface.

export interface Referral { company: string; kind: string; started: string; status: string; payout: string | null; }
export const REFERRAL_STATS = { bonus: 250, applied: 0, accountOpened: 0, totalEarned: 0 };
export const REFERRAL_TIERS = [{ name: 'Bronze', needed: 1 }, { name: 'Silver', needed: 5 }, { name: 'Gold', needed: 10 }, { name: 'Platinum', needed: 20 }];

export const REFERRALS: Referral[] = [];

