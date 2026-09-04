// Reference data for the interface.

export interface TaxAlert { text: string; action: string; }
export interface TaxFiler { name: string; w9: string; nec: string; misc: string; }
export const TAX_YEAR = 2026;
export const IRS_DEADLINE = '2/2/27';

export const TAX_ALERTS: TaxAlert[] = [
  {
    text: "4 recipients are missing W-9s Liam Carter +3 more",
    action: "Request W-9s"
  },
  {
    text: "Sarah Invalid State's W-9 has errors that need to be fixed",
    action: "Edit Filing"
  },
  {
    text: "Tom Missing State's W-9 has errors that need to be fixed",
    action: "Edit Filing"
  },
  {
    text: "Noah Miller has transactions that have not been assigned to a 1099",
    action: "Edit Filing"
  },
  {
    text: "Sophia Bennet has no payments to file",
    action: "Edit Filing"
  },
  {
    text: "You have 13 recipients with W-9s who are ready to start filing Return here after Jan 1, 2027 to file.",
    action: ""
  }
];

export const TAX_FILERS: TaxFiler[] = [
  {
    name: "Sarah Invalid State",
    w9: "Invalid State",
    nec: "$6,000.00",
    misc: "-"
  },
  {
    name: "Tom Missing State",
    w9: "Missing Address",
    nec: "$7,000.00",
    misc: "-"
  },
  {
    name: "Liam Carter",
    w9: "Missing",
    nec: "$8,765.43",
    misc: "-"
  },
  {
    name: "Sophia Bennet",
    w9: "Missing",
    nec: "No payments",
    misc: "No payments"
  },
  {
    name: "Ava Johnson",
    w9: "Missing",
    nec: "$11,234.56",
    misc: "-"
  },
  {
    name: "Noah Miller",
    w9: "Missing",
    nec: "Unassigned",
    misc: "Unassigned"
  },
  {
    name: "Emma Davis",
    w9: "Requested",
    nec: "$7,500.00",
    misc: "-"
  },
  {
    name: "Bob Padilla",
    w9: "Received",
    nec: "$6,890.25",
    misc: "-"
  },
  {
    name: "Pam Barnes",
    w9: "Received",
    nec: "$5,000.00",
    misc: "$2,208.94"
  },
  {
    name: "Fernando Bowen",
    w9: "Received",
    nec: "$8,123.45",
    misc: "-"
  },
  {
    name: "Carlos Holmes",
    w9: "Received",
    nec: "$9,345.67",
    misc: "-"
  },
  {
    name: "Jerome Hughes",
    w9: "Received",
    nec: "$7,500.00",
    misc: "$2,734.56"
  },
  {
    name: "Olivia Brown",
    w9: "Received",
    nec: "$9,200.00",
    misc: "-"
  },
  {
    name: "William Garcia",
    w9: "Received",
    nec: "$10,800.00",
    misc: "-"
  },
  {
    name: "James Wilson",
    w9: "Received",
    nec: "$7,650.00",
    misc: "-"
  },
  {
    name: "Carlos Fernando Santos Fuentes",
    w9: "Received",
    nec: "$8,500.00",
    misc: "-"
  },
  {
    name: "Rachel Green",
    w9: "Received",
    nec: "$8,900.00",
    misc: "-"
  },
  {
    name: "Michael Scott",
    w9: "Received",
    nec: "$12,500.00",
    misc: "-"
  },
  {
    name: "Morgan Wells",
    w9: "Received",
    nec: "$9,800.00",
    misc: "-"
  },
  {
    name: "Mason Taylor",
    w9: "Received",
    nec: "$8,000.00",
    misc: "$4,345.67"
  }
];

