// Reference data for the interface.

export interface Expense { date: string; member: string; status: string; amount: number | null; category: string; budget: string | null; }

export const EXPENSES: Expense[] = [
  {
    date: "Sep 2",
    member: "Jane Black",
    status: "Payment Pending",
    amount: 50.25,
    category: "Travel - Vehicles",
    budget: null
  },
  {
    date: "Sep 2",
    member: "Jane Black",
    status: "Pending Review",
    amount: 16.75,
    category: "Travel - Vehicles",
    budget: null
  },
  {
    date: "Aug 31",
    member: "Jane Black",
    status: "Declined",
    amount: 35.0,
    category: "Travel - Flights",
    budget: null
  },
  {
    date: "Aug 31",
    member: "Jane Black",
    status: "Payment Pending",
    amount: 15.82,
    category: "Business Client Meals",
    budget: null
  },
  {
    date: "Aug 31",
    member: "Jane Black",
    status: "Payment Pending",
    amount: 724.75,
    category: "Travel - Flights",
    budget: "Travel Budget"
  },
  {
    date: "Aug 30",
    member: "Jane Black",
    status: "Details Requested",
    amount: 480.5,
    category: "Travel - Flights",
    budget: "Office Supplies"
  },
  {
    date: "Oct 1",
    member: "Mary Metcalfe",
    status: "Pending Review",
    amount: 338.62,
    category: "Travel - Accommodation",
    budget: null
  },
  {
    date: "Oct 1",
    member: "Mary Metcalfe",
    status: "Pending Review",
    amount: 27.5,
    category: "Travel - Vehicles",
    budget: "Travel Budget"
  },
  {
    date: "Oct 1",
    member: "Team Member",
    status: "Pending Review",
    amount: 215.78,
    category: "Travel - Vehicles",
    budget: null
  },
  {
    date: "Oct 1",
    member: "Alice Chen",
    status: "Action Required",
    amount: 167.5,
    category: "Travel - Vehicles",
    budget: null
  },
  {
    date: "Jul 5",
    member: "Jessica Awad",
    status: "Pending Review",
    amount: 375.87,
    category: "Business Client Meals",
    budget: "Team Lunch"
  }
];

