export const SESSION_COOKIE = 'acme_session';

export const DEFAULT_ADMIN_PORTAL_HOST = 'admin.localhost';
export const DEFAULT_CLIENT_PORTAL_HOST = 'client.localhost';

export type AuthPortal = 'admin' | 'client' | 'shared';

function normalizeHostname(value: string | null | undefined) {
  const raw = (value ?? '').trim().toLowerCase();
  if (!raw) return '';

  if (raw.startsWith('[')) {
    const end = raw.indexOf(']');
    return end === -1 ? raw : raw.slice(1, end);
  }

  return raw.replace(/:\d+$/, '').replace(/\.$/, '');
}

/**
 * Maps the request host to an authentication realm. Cookies remain host-only,
 * so admin and client sessions can coexist safely in ordinary browser tabs.
 */
export function portalForHostname(hostname: string | null | undefined): AuthPortal {
  const current = normalizeHostname(hostname);
  const admin = hostnameForPortal('admin');
  const client = hostnameForPortal('client');

  if (current === admin) return 'admin';
  if (current === client) return 'client';
  return 'shared';
}

export function hostnameForPortal(portal: Exclude<AuthPortal, 'shared'>) {
  return normalizeHostname(
    portal === 'admin'
      ? process.env.ADMIN_PORTAL_HOST ?? DEFAULT_ADMIN_PORTAL_HOST
      : process.env.CLIENT_PORTAL_HOST ?? DEFAULT_CLIENT_PORTAL_HOST,
  );
}

export function roleMatchesPortal(role: string | undefined, portal: AuthPortal) {
  return portal === 'shared' || role === portal;
}
