/** Two independent, host-scoped sessions in one browser profile. */
import { chromium } from 'playwright';

const ADMIN_BASE = 'http://admin.localhost:3210';
const CLIENT_BASE = 'http://client.localhost:3210';
const TEMP_CLIENT = {
  username: 'parallel.session@example.com',
  password: 'ParallelAccess#2026!',
  displayName: 'Parallel Session',
};

const fails = [];
const check = (name, condition, detail = '') => {
  console.log(`${condition ? 'ok  ' : 'FAIL'} ${name}${detail ? `  ${detail}` : ''}`);
  if (!condition) fails.push(name);
};

async function api(page, path, { method = 'GET', data } = {}) {
  return page.evaluate(
    async ({ path, method, data }) => {
      const response = await fetch(path, {
        method,
        headers: data ? { 'content-type': 'application/json' } : undefined,
        body: data ? JSON.stringify(data) : undefined,
      });
      return {
        status: response.status,
        body: await response.json().catch(() => null),
      };
    },
    { path, method, data },
  );
}

async function login(page, base, username, password) {
  await page.goto(base + '/login', { waitUntil: 'networkidle' });
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('button[type=submit]');
  await page.waitForURL((url) => ['/admin', '/profile', '/dashboard'].includes(url.pathname), { timeout: 10000 });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const admin = await context.newPage();
const client = await context.newPage();
const errors = [];
for (const page of [admin, client]) {
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
}

let temporaryUserId = null;

try {
  await login(admin, ADMIN_BASE, 'admin', 'admin');
  check('admin portal lands on /admin', new URL(admin.url()).pathname === '/admin');

  await admin.goto(ADMIN_BASE + '/accounts', { waitUntil: 'networkidle' });
  check('admin portal opens the accounts view', new URL(admin.url()).pathname === '/accounts');
  await admin.goto(ADMIN_BASE + '/settings', { waitUntil: 'networkidle' });
  check('admin portal opens the settings view', new URL(admin.url()).pathname === '/settings');
  await admin.goto(ADMIN_BASE + '/admin', { waitUntil: 'networkidle' });

  const legacyAdmin = await context.newPage();
  await legacyAdmin.goto('http://localhost:3210/admin', { waitUntil: 'networkidle' });
  check('the legacy admin URL redirects to the isolated admin portal',
    new URL(legacyAdmin.url()).hostname === 'admin.localhost'
      && new URL(legacyAdmin.url()).pathname === '/admin');
  await legacyAdmin.close();

  const accounts = await api(admin, '/api/admin/accounts');
  check('an account is available for the temporary client', accounts.status === 200 && accounts.body.length > 0);

  const users = await api(admin, '/api/admin/users');
  const stale = users.body?.find((user) => user.username === TEMP_CLIENT.username);
  if (stale) await api(admin, `/api/admin/users/${stale.id}`, { method: 'DELETE' });

  const created = await api(admin, '/api/admin/users', {
    method: 'POST',
    data: {
      ...TEMP_CLIENT,
      role: 'client',
      accountIds: [accounts.body[0].id],
    },
  });
  temporaryUserId = created.body?.user?.id ?? null;
  check('temporary client is created', created.status === 201, String(created.status));

  await login(client, CLIENT_BASE, TEMP_CLIENT.username, TEMP_CLIENT.password);
  check('new client portal session requires profile setup', new URL(client.url()).pathname === '/profile');

  const completedProfile = await api(client, '/api/auth/profile', {
    method: 'POST',
    data: {
      preferredName: 'Parallel',
      legalName: 'Parallel Session',
      dateOfBirth: '1992-04-18',
      phoneNumber: '+33 6 98 76 54 32',
      residentialAddress: '8 Avenue de France\n75013 Paris\nFrance',
      mailingAddress: '8 Avenue de France\n75013 Paris\nFrance',
    },
  });
  check('client profile can be completed', completedProfile.status === 200, String(completedProfile.status));
  await client.goto(CLIENT_BASE + '/dashboard', { waitUntil: 'networkidle' });
  check('completed client lands on /dashboard', new URL(client.url()).pathname === '/dashboard');

  await Promise.all([
    admin.reload({ waitUntil: 'networkidle' }),
    client.reload({ waitUntil: 'networkidle' }),
  ]);

  const adminSession = await api(admin, '/api/auth/me');
  const clientSession = await api(client, '/api/auth/me');
  check('admin tab retains the admin role',
    adminSession.body?.user?.role === 'admin' && new URL(admin.url()).pathname === '/admin');
  check('client tab retains the client role',
    clientSession.body?.user?.role === 'client' && new URL(client.url()).pathname === '/dashboard');

  const sessionCookies = (await context.cookies()).filter((cookie) => cookie.name === 'acme_session');
  check('the browser stores two host-scoped session cookies',
    sessionCookies.some((cookie) => cookie.domain === 'admin.localhost')
      && sessionCookies.some((cookie) => cookie.domain === 'client.localhost'),
    sessionCookies.map((cookie) => cookie.domain).join(', '));
  check('both cookies are HttpOnly', sessionCookies.every((cookie) => cookie.httpOnly));
  check('no browser errors during both sign-in flows', errors.length === 0, errors.slice(0, 2).join(' | '));

  // These two deliberate 403 responses are reported as console errors by
  // Chromium, so the clean-console assertion belongs before the negative tests.
  const clientOnAdminPortal = await api(admin, '/api/auth/login', {
    method: 'POST',
    data: { username: TEMP_CLIENT.username, password: TEMP_CLIENT.password },
  });
  check('admin portal rejects client credentials', clientOnAdminPortal.status === 403,
    `${clientOnAdminPortal.status} ${JSON.stringify(clientOnAdminPortal.body)}`);

  const adminOnClientPortal = await api(client, '/api/auth/login', {
    method: 'POST',
    data: { username: 'admin', password: 'admin' },
  });
  check('client portal rejects admin credentials', adminOnClientPortal.status === 403,
    `${adminOnClientPortal.status} ${JSON.stringify(adminOnClientPortal.body)}`);

  await client.goto(CLIENT_BASE + '/admin', { waitUntil: 'networkidle' });
  check('client portal cannot open /admin', new URL(client.url()).pathname === '/dashboard', client.url());

  await admin.reload({ waitUntil: 'networkidle' });
  check('client navigation does not disturb the admin tab', new URL(admin.url()).pathname === '/admin', admin.url());
} finally {
  if (temporaryUserId) {
    await api(admin, `/api/admin/users/${temporaryUserId}`, { method: 'DELETE' }).catch(() => {});
  }
  await context.close();
  await browser.close();
}

console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall parallel-session checks passed');
process.exit(fails.length ? 1 : 0);
