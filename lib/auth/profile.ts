import type { ClientProfile, User } from './types';

export type ClientProfileDraft = Pick<
  ClientProfile,
  | 'preferredName'
  | 'legalName'
  | 'dateOfBirth'
  | 'phoneNumber'
  | 'residentialAddress'
  | 'mailingAddress'
>;

export type ClientProfileErrors = Partial<Record<keyof ClientProfileDraft, string>>;

export const EMPTY_CLIENT_PROFILE: ClientProfileDraft = {
  preferredName: '',
  legalName: '',
  dateOfBirth: '',
  phoneNumber: '',
  residentialAddress: '',
  mailingAddress: '',
};

const cleanLine = (value: unknown) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

const cleanAddress = (value: unknown) =>
  typeof value === 'string'
    ? value
        .split(/\r?\n/)
        .map((line) => line.trim().replace(/\s+/g, ' '))
        .filter(Boolean)
        .join('\n')
    : '';

export function normalizeClientProfile(input: Partial<ClientProfileDraft>): ClientProfileDraft {
  return {
    preferredName: cleanLine(input.preferredName),
    legalName: cleanLine(input.legalName),
    dateOfBirth: cleanLine(input.dateOfBirth),
    phoneNumber: cleanLine(input.phoneNumber),
    residentialAddress: cleanAddress(input.residentialAddress),
    mailingAddress: cleanAddress(input.mailingAddress),
  };
}

function validCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <= Date.now()
  );
}

export function validateClientProfile(profile: ClientProfileDraft): ClientProfileErrors {
  const errors: ClientProfileErrors = {};

  if (profile.preferredName.length < 1 || profile.preferredName.length > 80) {
    errors.preferredName = 'Enter the name you would like us to use.';
  }
  if (profile.legalName.length < 2 || profile.legalName.length > 120) {
    errors.legalName = 'Enter your full legal name.';
  }
  if (!validCalendarDate(profile.dateOfBirth)) {
    errors.dateOfBirth = 'Enter a valid date of birth.';
  }

  const phoneDigits = profile.phoneNumber.replace(/\D/g, '');
  if (phoneDigits.length < 6 || phoneDigits.length > 15) {
    errors.phoneNumber = 'Enter a valid phone number, including the country code.';
  }
  if (profile.residentialAddress.length < 8 || profile.residentialAddress.length > 300) {
    errors.residentialAddress = 'Enter your complete residential address.';
  }
  if (profile.mailingAddress.length < 8 || profile.mailingAddress.length > 300) {
    errors.mailingAddress = 'Enter your complete mailing address.';
  }

  return errors;
}

export function profileDraftForUser(
  user: Pick<User, 'username' | 'displayName' | 'profile'>,
): ClientProfileDraft {
  if (!user.profile) {
    // `displayName` falls back to the sign-in identity when the administrator
    // left it blank. That is an address, not a name, and offering it as the
    // client's preferred name is worse than offering nothing.
    const named = user.displayName.trim().toLowerCase() !== user.username.trim().toLowerCase();
    return {
      ...EMPTY_CLIENT_PROFILE,
      preferredName: named ? user.displayName : '',
    };
  }
  return {
    preferredName: user.profile.preferredName,
    legalName: user.profile.legalName,
    dateOfBirth: user.profile.dateOfBirth,
    phoneNumber: user.profile.phoneNumber,
    residentialAddress: user.profile.residentialAddress,
    mailingAddress: user.profile.mailingAddress,
  };
}
