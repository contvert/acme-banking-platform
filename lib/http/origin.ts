/**
 * Rejects a state-changing request whose `Origin` is not this site. A browser
 * sets that header on cross-site POSTs and cannot be talked out of it, so it
 * is what stops another page from acting through a visitor's session cookie.
 *
 * A missing `Origin` is allowed: same-origin form posts and server-to-server
 * callers omit it, and the session check is what authorises them.
 */
export function foreignOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}
