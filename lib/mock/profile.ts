// Reference data for the interface.

export interface ProfileField { label: string; value: string[]; action: string; hint?: string; }
export const PROFILE_ROLE = 'Admin';
export const LINKED_PROFILES = [
  'graceh@example.invalid', 'grace@debug-llc.invalid', 'xavier@pico.invalid',
];
export const PROFILE_ACCOUNTS = [
  { org: 'Acme', label: 'Primary' },
  { org: "Jane's Account", label: 'Personal' },
];

export const PROFILE_FIELDS: ProfileField[] = [
  {
    label: "Profile picture",
    value: [],
    action: "Edit"
  },
  {
    label: "Email address",
    value: [
      "jane@acme.example"
    ],
    action: "Edit"
  },
  {
    label: "Preferred name",
    value: [
      "Jane Black"
    ],
    action: "Edit"
  },
  {
    label: "Legal name",
    value: [
      "Imogen Black"
    ],
    action: "Edit"
  },
  {
    label: "Date of birth",
    value: [
      "01/31/1990"
    ],
    action: "Edit"
  },
  {
    label: "Job title",
    value: [],
    action: "Add"
  },
  {
    label: "Phone number",
    value: [
      "+1 (330) 678-3920"
    ],
    action: "Edit"
  },
  {
    label: "Residential address",
    value: [
      "2261 Market St",
      "Suite 86807",
      "San Francisco, CA 94114",
      "United States"
    ],
    action: "Edit"
  },
  {
    label: "Mailing address",
    value: [
      "77 Bloor St",
      "Unit #600",
      "Toronto, ON M5S 1M2",
      "Canada"
    ],
    action: "Edit",
    hint: "Physical cards are sent to this address."
  }
];

