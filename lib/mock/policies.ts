// Reference data for the interface.

export interface Policy { title: string; rule: string; threshold: number; excluded: string[]; }

export const POLICIES: Policy[] = [
  {
    title: "Receipt requirement",
    rule: "Receipt required if transaction amount exceeds",
    threshold: 75,
    excluded: [
      "Amazon Web Services",
      "Facebook",
      "Google",
      "Notion",
      "Github"
    ]
  },
  {
    title: "Notes requirement",
    rule: "Notes required if transaction amount exceeds",
    threshold: 100,
    excluded: []
  },
  {
    title: "Category requirement",
    rule: "Category required if transaction amount exceeds",
    threshold: 1,
    excluded: []
  }
];

