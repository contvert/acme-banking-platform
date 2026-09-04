// Reference data for the interface.

export interface DocTab { slug: string; label: string; headers: string[]; rows: string[][]; }

export const DOC_TABS: DocTab[] = [
  {
    slug: "statements",
    label: "Statements",
    headers: [
      "Statement period",
      "Account"
    ],
    rows: [
      [
        "Aug 2026",
        "Credit"
      ],
      [
        "Aug 2026",
        "Treasury"
      ],
      [
        "Aug 2026",
        "Ops / Payroll"
      ],
      [
        "Aug 2026",
        "AP"
      ],
      [
        "Aug 2026",
        "AR"
      ],
      [
        "Aug 2026",
        "Sweep summary"
      ],
      [
        "Jul 2026",
        "Credit"
      ],
      [
        "Jul 2026",
        "Treasury"
      ],
      [
        "Jul 2026",
        "Ops / Payroll"
      ],
      [
        "Jul 2026",
        "AP"
      ],
      [
        "Jul 2026",
        "AR"
      ],
      [
        "Jul 2026",
        "Sweep summary"
      ],
      [
        "Jun 2026",
        "Credit"
      ],
      [
        "Jun 2026 More info",
        "Treasury"
      ],
      [
        "Jun 2026 More info",
        "Treasury"
      ],
      [
        "Jun 2026 More info",
        "Treasury"
      ],
      [
        "Jun 2026",
        "Ops / Payroll"
      ],
      [
        "Jun 2026",
        "AP"
      ],
      [
        "Jun 2026",
        "AR"
      ],
      [
        "Jun 2026",
        "Sweep summary"
      ],
      [
        "May 2026",
        "Credit"
      ],
      [
        "May 2026",
        "Treasury"
      ],
      [
        "May 2026",
        "Ops / Payroll"
      ],
      [
        "May 2026",
        "AP"
      ],
      [
        "May 2026",
        "AR"
      ],
      [
        "Apr 2026",
        "Credit"
      ],
      [
        "Apr 2026",
        "Treasury"
      ],
      [
        "Apr 2026",
        "Ops / Payroll"
      ],
      [
        "Apr 2026",
        "AP"
      ],
      [
        "Apr 2026",
        "AR"
      ],
      [
        "Mar 2026",
        "Credit"
      ],
      [
        "Mar 2026",
        "Treasury"
      ],
      [
        "Mar 2026",
        "Ops / Payroll"
      ],
      [
        "Mar 2026",
        "AP"
      ],
      [
        "Mar 2026",
        "AR"
      ],
      [
        "Feb 2026",
        "Credit"
      ],
      [
        "Feb 2026",
        "Treasury"
      ],
      [
        "Feb 2026",
        "Ops / Payroll"
      ],
      [
        "Feb 2026",
        "AP"
      ],
      [
        "Feb 2026",
        "AR"
      ],
      [
        "Jan 2026",
        "Credit"
      ],
      [
        "Jan 2026",
        "Treasury"
      ],
      [
        "Jan 2026",
        "Ops / Payroll"
      ],
      [
        "Jan 2026",
        "AP"
      ],
      [
        "Jan 2026",
        "AR"
      ]
    ]
  },
  {
    slug: "receipts-and-attachments",
    label: "Receipts & Attachments",
    headers: [],
    rows: []
  },
  {
    slug: "company-documents",
    label: "Company Documents",
    headers: [
      "Documents"
    ],
    rows: [
      [
        "Doing Business As (DBA)"
      ],
      [
        "Articles of Incorporation"
      ]
    ]
  },
  {
    slug: "tax-documents",
    label: "Tax Documents",
    headers: [
      "Document",
      "Description"
    ],
    rows: [
      [
        "1099-INT 2025",
        "For all of your checking and savings accounts"
      ],
      [
        "1099-INT 2025",
        "For Savings ••7658"
      ]
    ]
  },
  {
    slug: "recipient-tax-forms",
    label: "Recipient Tax Forms",
    headers: [
      "File name"
    ],
    rows: [
      [
        "Karim Halabi W-9"
      ],
      [
        "Jason Green W-9"
      ],
      [
        "Stefanie Katz W-9"
      ]
    ]
  },
  {
    slug: "ndas",
    label: "NDAs",
    headers: [
      "Last updated",
      "Recipient"
    ],
    rows: [
      [
        "Aug 31, 2026",
        "Jason Green"
      ],
      [
        "Aug 22, 2026",
        "Dana Whitfield"
      ]
    ]
  },
  {
    slug: "bank-letters",
    label: "Bank Letters",
    headers: [
      "Account"
    ],
    rows: [
      [
        "Ops / Payroll"
      ],
      [
        "AP"
      ],
      [
        "AR"
      ],
      [
        "Checking ••0297"
      ],
      [
        "Savings ••7658"
      ]
    ]
  },
  {
    slug: "wire-details",
    label: "Wire Details",
    headers: [
      "Account"
    ],
    rows: [
      [
        "Ops / Payroll"
      ],
      [
        "AP"
      ],
      [
        "AR"
      ],
      [
        "Checking ••0297"
      ],
      [
        "Savings ••7658"
      ]
    ]
  },
  {
    slug: "trade-confirmations",
    label: "Trade Confirmations",
    headers: [
      "Date",
      "Trade confirmation"
    ],
    rows: [
      [
        "Aug 1, 2026",
        "Treasury trade confirmation"
      ],
      [
        "Jul 1, 2026",
        "Treasury trade confirmation"
      ],
      [
        "Jun 1, 2026",
        "Treasury trade confirmation"
      ],
      [
        "May 1, 2026",
        "Treasury trade confirmation"
      ],
      [
        "Apr 1, 2026",
        "Treasury trade confirmation"
      ],
      [
        "Mar 1, 2026",
        "Treasury trade confirmation"
      ],
      [
        "Feb 1, 2026",
        "Treasury trade confirmation"
      ],
      [
        "Jan 1, 2026",
        "Treasury trade confirmation"
      ]
    ]
  },
  {
    slug: "billing-history",
    label: "Billing History",
    headers: [
      "Invoice period",
      "Description"
    ],
    rows: [
      [
        "Jul 31, 2026",
        "Acme Pro Subscription | Jul 31 - Jul 31, 2026"
      ]
    ]
  },
  {
    slug: "support-requests",
    label: "Support Requests",
    headers: [
      "Date",
      "Description"
    ],
    rows: [
      [
        "Sep 9, 2023",
        "Secure Message file.pdf random-test.txt"
      ],
      [
        "Jul 7, 2023",
        "no-note.pdf"
      ],
      [
        "May 6, 2023",
        "Secure Message custom-statement.txt"
      ]
    ]
  },
  {
    slug: "notices",
    label: "Notices",
    headers: [
      "Notices & agreements"
    ],
    rows: [
      [
        "Acme Form ADV Brochure"
      ]
    ]
  },
  {
    slug: "other",
    label: "Other",
    headers: [
      "Document"
    ],
    rows: [
      [
        "Notice to Shareholders.pdf"
      ],
      [
        "employee-handbook.pdf"
      ]
    ]
  }
];

