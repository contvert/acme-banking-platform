// Reference data for the interface.

export interface Referral { company: string; kind: string; started: string; status: string; payout: string | null; }
export const REFERRAL_STATS = { bonus: 250, applied: 7, accountOpened: 6, totalEarned: 900 };
export const REFERRAL_TIERS = [{ name: 'Bronze', needed: 1 }, { name: 'Silver', needed: 5 }, { name: 'Gold', needed: 10 }, { name: 'Platinum', needed: 20 }];

export const REFERRALS: Referral[] = [
  {
    company: "Widgets Inc.",
    kind: "Business Banking",
    started: "Mar 3, 2018",
    status: "Paid",
    payout: "$250.00 paid on Mar 4, 2018"
  },
  {
    company: "Wanda’s Brooms",
    kind: "Personal Banking",
    started: "Mar 3, 2018",
    status: "Account Opened",
    payout: null
  },
  {
    company: "Stonewall Security",
    kind: "Business Banking",
    started: "Mar 3, 2018",
    status: "Account Opened",
    payout: null
  },
  {
    company: "Rick’s Shoes",
    kind: "Personal Banking",
    started: "Mar 3, 2018",
    status: "Expired",
    payout: null
  },
  {
    company: "Razer Capital",
    kind: "Business Banking",
    started: "Mar 3, 2018",
    status: "Applied",
    payout: null
  },
  {
    company: "Pluto Import & Export",
    kind: "Business Banking",
    started: "Mar 3, 2018",
    status: "Started",
    payout: null
  },
  {
    company: "Pendulum Labs",
    kind: "Business Banking",
    started: "Mar 3, 2018",
    status: "Account Opened",
    payout: null
  },
  {
    company: "Miles Stone & Sons",
    kind: "Business Banking",
    started: "Mar 3, 2018",
    status: "Paid",
    payout: "$500.00 paid on Mar 4, 2018"
  },
  {
    company: "John’s Watches",
    kind: "Personal Banking",
    started: "Mar 3, 2018",
    status: "Account Opened",
    payout: null
  },
  {
    company: "Chocolate Frontiers",
    kind: "Business Banking",
    started: "Mar 3, 2018",
    status: "Expired",
    payout: null
  }
];

