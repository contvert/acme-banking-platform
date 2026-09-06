// Reference data for the interface.

export interface Advisor { name: string; email: string; role: string; status: string; firm: string | null; }
export const ADVISOR_PENDING = { firm: '', note: '' };

export const ADVISORS: Advisor[] = [];

