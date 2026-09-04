// Reference data for the interface.

export interface Split { key: string; title: string; total: number; monthlyAverage: number; }

export const INSIGHT_SPLITS: Split[] = [
  {
    key: "money-in",
    title: "Money in",
    total: 1900000,
    monthlyAverage: 381923
  },
  {
    key: "money-out",
    title: "Money out",
    total: -911605,
    monthlyAverage: -182321
  }
];

