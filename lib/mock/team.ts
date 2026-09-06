// Reference data for the interface.settings_users.json

export interface TeamMember { name: string; email: string; role: string; title: string | null; department: string | null; status: string; you: boolean; }

export const TEAM: TeamMember[] = [];
