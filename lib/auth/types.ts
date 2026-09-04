export type Role = 'admin' | 'client';

export interface ClientProfile {
  preferredName: string;
  legalName: string;
  /** ISO calendar date (YYYY-MM-DD). */
  dateOfBirth: string;
  phoneNumber: string;
  residentialAddress: string;
  mailingAddress: string;
  completedAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  /** Used to sign in. Stored lower-cased. */
  username: string;
  displayName: string;
  role: Role;
  /** scrypt hash and its salt, never sent to a client. */
  passwordHash: string;
  salt: string;
  /** Accounts this user may see. Empty means every account (admins). */
  accountIds: string[];
  createdAt: string;
  lastLoginAt: string | null;
  disabled: boolean;
  /** Sensitive client details. Never include this object in PublicUser. */
  profile?: ClientProfile;
}

/** What the app is allowed to know about the signed-in user on the client. */
export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  accountIds: string[];
  /** Safe onboarding state; the profile fields themselves stay server-side. */
  profileComplete: boolean;
}

export const isProfileComplete = (u: Pick<User, 'role' | 'profile'>) => {
  if (u.role === 'admin') return true;
  const profile = u.profile;
  return Boolean(
    profile?.completedAt &&
    profile.preferredName.trim() &&
    profile.legalName.trim() &&
    profile.dateOfBirth.trim() &&
    profile.phoneNumber.trim() &&
    profile.residentialAddress.trim() &&
    profile.mailingAddress.trim(),
  );
};

export const toPublicUser = (u: User): PublicUser => ({
  id: u.id,
  username: u.username,
  displayName: u.displayName,
  role: u.role,
  accountIds: u.accountIds,
  profileComplete: isProfileComplete(u),
});

export interface SessionPayload {
  userId: string;
  role: Role;
  /** Missing on legacy tokens and therefore treated as incomplete for clients. */
  profileComplete?: boolean;
  /** Unix seconds. */
  exp: number;
}
