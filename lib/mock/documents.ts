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
    rows: []
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
    rows: []
  },
  {
    slug: "tax-documents",
    label: "Tax Documents",
    headers: [
      "Document",
      "Description"
    ],
    rows: []
  },
  {
    slug: "recipient-tax-forms",
    label: "Recipient Tax Forms",
    headers: [
      "File name"
    ],
    rows: []
  },
  {
    slug: "ndas",
    label: "NDAs",
    headers: [
      "Last updated",
      "Recipient"
    ],
    rows: []
  },
  {
    slug: "bank-letters",
    label: "Bank Letters",
    headers: [
      "Account"
    ],
    rows: []
  },
  {
    slug: "wire-details",
    label: "Wire Details",
    headers: [
      "Account"
    ],
    rows: []
  },
  {
    slug: "trade-confirmations",
    label: "Trade Confirmations",
    headers: [
      "Date",
      "Trade confirmation"
    ],
    rows: []
  },
  {
    slug: "billing-history",
    label: "Billing History",
    headers: [
      "Invoice period",
      "Description"
    ],
    rows: []
  },
  {
    slug: "support-requests",
    label: "Support Requests",
    headers: [
      "Date",
      "Description"
    ],
    rows: []
  },
  {
    slug: "notices",
    label: "Notices",
    headers: [
      "Notices & agreements"
    ],
    rows: []
  },
  {
    slug: "other",
    label: "Other",
    headers: [
      "Document"
    ],
    rows: []
  }
];

