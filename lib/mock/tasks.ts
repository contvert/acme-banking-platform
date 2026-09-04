// Reference data for the interface.

export interface Task { description: string; received: string; action: string; }

export const TASKS: Task[] = [
  {
    description: "Review pending emails that can auto-forward to receipts@acme.example",
    received: "Sep 3",
    action: "View"
  },
  {
    description: "Landon Shepherd requested a receipt policy exemption on a transaction at Monarch Books.",
    received: "Sep 3",
    action: "View"
  },
  {
    description: "Review category for your $300.03 Uber Eats transaction",
    received: "Sep 3",
    action: "Review"
  },
  {
    description: "Approve Jane Black’s overspend on the Hardware budget",
    received: "Sep 3",
    action: "Approve"
  },
  {
    description: "Approve team invite for Bruce Collins (requested by Landon Shepherd)",
    received: "Sep 2",
    action: "View"
  },
  {
    description: "Approve $1,042.95 payment to Jason Green (requested by Alice C.)",
    received: "Sep 2",
    action: "View"
  },
  {
    description: "Approve $5,000.00 recurring payment to Jason Green (requested by Alice C.)",
    received: "Sep 2",
    action: "View"
  },
  {
    description: "Approve new daily maximum payment limit (requested by Landon Shepherd)",
    received: "Sep 2",
    action: "View"
  },
  {
    description: "Approve enabling the dual admin approval policy (requested by Landon Shepherd)",
    received: "Sep 2",
    action: "View"
  },
  {
    description: "Approve $375.87 reimbursement from Jessica Awad at The Bayside Bistro",
    received: "Sep 2",
    action: "View"
  }
];

