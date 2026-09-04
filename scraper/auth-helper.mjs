/** Shared sign-in for the audits and interaction tests, now that every route
 *  and every admin endpoint sits behind a session. */
export const ADMIN = { username: 'admin', password: 'admin' };
export const BASE = 'http://localhost:3210';

/** Signs a Playwright browser context in, so its pages carry the cookie. */
export async function signIn(context, base = BASE, creds = ADMIN) {
  const res = await context.request.post(base + '/api/auth/login', { data: creds });
  if (!res.ok()) throw new Error(`sign-in failed: ${res.status()} ${await res.text()}`);
  return res;
}

/**
 * A plain `fetch` that carries a session cookie, for tests that drive the API
 * directly rather than through a browser.
 */
export async function authedFetch(base = BASE, creds = ADMIN) {
  const res = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(creds),
  });
  if (!res.ok) throw new Error(`sign-in failed: ${res.status}`);

  const cookie = (res.headers.getSetCookie?.() ?? [])
    .map((c) => c.split(';')[0])
    .join('; ');

  return (path, init = {}) =>
    fetch(base + path, {
      ...init,
      headers: { 'content-type': 'application/json', cookie, ...(init.headers ?? {}) },
    });
}
