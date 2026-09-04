// Reference data for the interface.

export interface Check { checkNo: string; received: string; amount: number | null; payFrom: string; reviewStatus: string; }

export const CHECKS: Check[] = [
  {
    checkNo: "1001",
    received: "Mar 20, 2024",
    amount: 1250.75,
    payFrom: "Ops / Payroll",
    reviewStatus: "5hr"
  },
  {
    checkNo: "1003",
    received: "Mar 21, 2024",
    amount: 3500.5,
    payFrom: "Ops / Payroll",
    reviewStatus: "7hr"
  },
  {
    checkNo: "1004",
    received: "Mar 21, 2024",
    amount: 12000.0,
    payFrom: "Ops / Payroll",
    reviewStatus: "2hr"
  },
  {
    checkNo: "1010",
    received: "Mar 22, 2024",
    amount: 4321.0,
    payFrom: "Ops / Payroll",
    reviewStatus: "11hr"
  },
  {
    checkNo: "1002",
    received: "Mar 20, 2024",
    amount: 5000.0,
    payFrom: "Ops / Payroll",
    reviewStatus: "Processing"
  },
  {
    checkNo: "1005",
    received: "Mar 21, 2024",
    amount: 750.25,
    payFrom: "Ops / Payroll",
    reviewStatus: "Processing"
  }
];

