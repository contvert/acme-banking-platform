// Reference data for the interface.

export interface Drawdown { created: string; recipient: string; limit: number | null; payFrom: string; }
export interface AchAuth { vendor: string; authorizedOn: string; account: string; limit: number | null; }
export const ACH_FLAGGED = 0;

export const DRAWDOWNS: Drawdown[] = [];

export const ACH_AUTHS: AchAuth[] = [];

