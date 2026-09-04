// Reference data for the interface.settings_users.json

export interface TeamMember { name: string; email: string; role: string; title: string | null; department: string | null; status: string; you: boolean; }

export const TEAM: TeamMember[] = [
  {
    name: "Abigail Kyte",
    email: "abigail@acme.example",
    role: "Read Only",
    title: "Product Manager",
    department: "Design",
    status: "Active",
    you: false
  },
  {
    name: "Alice Chen",
    email: "alice@acme.example",
    role: "Money Mover",
    title: "Software Engineer",
    department: "Finance",
    status: "Active",
    you: false
  },
  {
    name: "Anthony Buteo",
    email: "anthony@acme.example",
    role: "Read Only",
    title: "Product Manager",
    department: "Accounting",
    status: "Active",
    you: false
  },
  {
    name: "Carry Beck",
    email: "carry@acme.example",
    role: "Employee",
    title: "Operations Lead",
    department: "Design",
    status: "Active",
    you: false
  },
  {
    name: "Dave Walker",
    email: "dave@acme.example",
    role: "Read Only",
    title: "Engineer",
    department: null,
    status: "Active",
    you: false
  },
  {
    name: "Emmett Brown",
    email: "doc@acme.example",
    role: "Money Mover",
    title: null,
    department: null,
    status: "Active",
    you: false
  },
  {
    name: "Jane Black",
    email: "jane@acme.example",
    role: "Admin",
    title: "Other C-Level (e.g. COO, CTO)",
    department: "Executive",
    status: "Active",
    you: true
  },
  {
    name: "Jessica Awad",
    email: "jessica@acme.example",
    role: "Money Mover",
    title: "Other C-Level (e.g. COO, CTO)",
    department: "Accounting",
    status: "Active",
    you: false
  },
  {
    name: "John Miller",
    email: "john@acme.example",
    role: "Read Only",
    title: "Designer",
    department: null,
    status: "Active",
    you: false
  },
  {
    name: "Landon Shepherd",
    email: "landon@acme.example",
    role: "Admin",
    title: "Other C-Level (e.g. COO, CTO)",
    department: "Design",
    status: "Active",
    you: false
  },
  {
    name: "Mary Metcalfe",
    email: "mary@acme.example",
    role: "Admin",
    title: "VP of Finance",
    department: "Design",
    status: "Active",
    you: false
  },
  {
    name: "Multiple Pending Employee",
    email: "multiple-pending@acme.example",
    role: "Employee",
    title: "Data Scientist",
    department: "Audit",
    status: "Active",
    you: false
  },
  {
    name: "No Engagement",
    email: "no-engagement@acme.example",
    role: "Employee",
    title: "Data Scientist",
    department: "Audit",
    status: "Active",
    you: false
  },
  {
    name: "Noel Kim",
    email: "noel@acme.example",
    role: "Read Only",
    title: "Designer",
    department: "Audit",
    status: "Active",
    you: false
  },
  {
    name: "Onboarding Incomplete",
    email: "onboarding-incomplete@acme.example",
    role: "Employee",
    title: "Data Scientist",
    department: "Audit",
    status: "Active",
    you: false
  },
  {
    name: "Sally Park",
    email: "sally@acme.example",
    role: "Employee",
    title: "Account Coordinator",
    department: "Accounting",
    status: "Active",
    you: false
  },
  {
    name: "Starting Soon",
    email: "starting-soon@acme.example",
    role: "Employee",
    title: "Data Scientist",
    department: "Audit",
    status: "Active",
    you: false
  },
  {
    name: "Stephen Miles",
    email: "stephen@acme.example",
    role: "Employee",
    title: "Data Scientist",
    department: "Audit",
    status: "Active",
    you: false
  },
  {
    name: "Thomas Brown",
    email: "thomas@acme.example",
    role: "Read Only",
    title: "Marketing",
    department: null,
    status: "Active",
    you: false
  },
  {
    name: "Bruce Collins",
    email: "bruce@acme.example",
    role: "Admin",
    title: "Software Engineer",
    department: null,
    status: "Invited",
    you: false
  },
  {
    name: "Phil Coulson",
    email: "phil@acme.example",
    role: "Money Mover",
    title: "Other C-Level (e.g. COO, CTO)",
    department: null,
    status: "Invited",
    you: false
  },
  {
    name: "Barbara Carpenter",
    email: "barbara@acme.example",
    role: "N/A",
    title: "Other C-Level (e.g. COO, CTO)",
    department: null,
    status: "Removed",
    you: false
  },
  {
    name: "Blake Walker",
    email: "blake@acme.example",
    role: "N/A",
    title: "Other C-Level (e.g. COO, CTO)",
    department: null,
    status: "Removed",
    you: false
  }
];
