// Reference data for the interface.

export interface Advisor { name: string; email: string; role: string; status: string; firm: string | null; }
export const ADVISOR_PENDING = { firm: 'Pico Accountants', note: 'Advisor access request by Lily O. today' };

export const ADVISORS: Advisor[] = [
  {
    name: "Andrew Jeffords",
    email: "mary@acme.example",
    role: "Admin",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Brian Ford",
    email: "brian@acme.example",
    role: "Manager (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Brock Forestead",
    email: "brock@acme.example",
    role: "Manager (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Bryce Clay",
    email: "bryce@acme.example",
    role: "Staff Accountant (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Campbell Majors",
    email: "campbell@acme.example",
    role: "Staff Accountant (Advisor)",
    status: "Removed",
    firm: "Goose Creek"
  },
  {
    name: "Carly Avines",
    email: "carly@acme.example",
    role: "Manager (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Jane Black",
    email: "jane@acme.example",
    role: "Admin",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Paul Paulson",
    email: "paul@acme.example",
    role: "Manager (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Pedro Nuñes",
    email: "pedro@acme.example",
    role: "Staff Accountant (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Shawn Bruce",
    email: "shawn@acme.example",
    role: "Staff Accountant (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Silvia Branch",
    email: "silvia@acme.example",
    role: "Manager (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Xavier Xyloto",
    email: "xavier@acme.example",
    role: "Staff Accountant (Advisor)",
    status: "Active",
    firm: "Goose Creek"
  },
  {
    name: "Andrew Jeffords",
    email: "mary@acme.example",
    role: "Admin",
    status: "Active",
    firm: "Pico Accountants"
  },
  {
    name: "Bryce Clay",
    email: "bryce@acme.example",
    role: "Staff Accountant (Advisor)",
    status: "Active",
    firm: "Pico Accountants"
  },
  {
    name: "Carly Avines",
    email: "carly@acme.example",
    role: "Manager (Advisor)",
    status: "Active",
    firm: "Pico Accountants"
  },
  {
    name: "Jane Black",
    email: "jane@acme.example",
    role: "Admin",
    status: "Active",
    firm: "Pico Accountants"
  },
  {
    name: "Pedro Nuñes",
    email: "pedro@acme.example",
    role: "Staff Accountant (Advisor)",
    status: "Active",
    firm: "Pico Accountants"
  },
  {
    name: "Silvia Branch",
    email: "silvia@acme.example",
    role: "Manager (Advisor)",
    status: "Active",
    firm: "Pico Accountants"
  }
];

