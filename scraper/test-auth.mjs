/** Auth: sign-in, role separation, client scoping, and access provisioning. */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3210';
const fails = [];
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
  if (!cond) fails.push(name);
};

const browser = await chromium.launch({ headless: true });

/* ---------------------------------------------- signed out is locked out */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  check('dashboard redirects to login', new URL(page.url()).pathname === '/login',
    new URL(page.url()).pathname);
  check('the intended route is remembered',
    new URL(page.url()).searchParams.get('next') === '/dashboard');

  await page.goto(BASE + '/admin', { waitUntil: 'networkidle' });
  check('admin redirects to login', new URL(page.url()).pathname === '/login');

  const api = await page.request.get(BASE + '/api/admin/config');
  check('admin API refuses anonymous', api.status() === 401, String(api.status()));
  const anonymousProfile = await page.request.get(BASE + '/api/auth/profile');
  check('profile API refuses anonymous access', anonymousProfile.status() === 401,
    String(anonymousProfile.status()));

  const bad = await page.request.post(BASE + '/api/auth/login', {
    data: { username: 'admin', password: 'wrong' },
  });
  check('wrong password refused', bad.status() === 401, String(bad.status()));
  const body = await bad.json();
  check('failure message does not leak whether the user exists',
    !/utilisateur|inconnu|existe/i.test(body.error ?? ''), body.error);

  const ghost = await page.request.post(BASE + '/api/auth/login', {
    data: { username: 'nobody-here', password: 'whatever' },
  });
  check('unknown user gets the same message',
    (await ghost.json()).error === body.error);

  await ctx.close();
}

/* ----------------------- fresh seed credentials are available, but discreet */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const seed = await (await page.request.get(BASE + '/api/auth/first-run')).json();
  check('first-run endpoint reports a boolean state', typeof seed.firstRun === 'boolean', JSON.stringify(seed));

  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const login = await page.evaluate(() => ({
    copy: document.body.innerText,
    u: document.querySelector('#username')?.value,
    p: document.querySelector('#password')?.value,
    hasOpenAccount: document.querySelector('a[href="/signup"]')?.textContent?.trim() === 'Open Account',
  }));
  check('the login page uses the reference copy',
    /Log in/.test(login.copy) && /Continue with passkey/.test(login.copy));
  check('the old first-run panel is gone', !/Première connexion|Remplir le formulaire/.test(login.copy));
  const expectedSeed = seed.firstRun
    ? login.u === seed.username && login.p === seed.password
    : login.u === '' && login.p === '';
  check('login prefill follows the first-run state', expectedSeed,
    JSON.stringify({ u: login.u, p: login.p ? '(filled)' : '(empty)' }));
  check('the signup action is available', login.hasOpenAccount === true);
  await ctx.close();
}

/* ------------------------------------------------------- admin signs in */
const adminCtx = await browser.newContext();
let clientCreds = null;
{
  const page = await adminCtx.newPage();
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin');
  await page.click('button[type=submit]');
  await page.waitForURL('**/admin', { timeout: 10000 }).catch(() => {});
  check('admin lands on the panel', new URL(page.url()).pathname === '/admin',
    new URL(page.url()).pathname);

  // give the client an account to see
  const accounts = await (await page.request.get(BASE + '/api/admin/accounts')).json();
  check('an account exists to assign', accounts.length > 0);

  clientCreds = { username: 'client.test@example.com', password: 'motdepasse123' };
  const created = await page.request.post(BASE + '/api/admin/users', {
    data: {
      ...clientCreds,
      displayName: 'Client Test',
      role: 'client',
      accountIds: [accounts[0].id],
    },
  });
  check('admin can provision a client', created.status() === 201, String(created.status()));

  const weak = await page.request.post(BASE + '/api/admin/users', {
    data: { username: 'weak.user', password: 'short', displayName: 'X', role: 'client', accountIds: [] },
  });
  check('short passwords are rejected', weak.status() === 400);

  const dupe = await page.request.post(BASE + '/api/admin/users', {
    data: { ...clientCreds, displayName: 'Dup', role: 'client', accountIds: [] },
  });
  check('duplicate usernames are rejected', dupe.status() === 400);

  const users = await (await page.request.get(BASE + '/api/admin/users')).json();
  check('no password material is ever returned',
    users.every((u) => !('passwordHash' in u) && !('salt' in u)));

  const selfDelete = await page.request.delete(BASE + '/api/admin/users/usr-admin');
  check('an admin cannot delete their own access', selfDelete.status() === 400);
  const adminProfile = await page.request.get(BASE + '/api/auth/profile');
  check('an admin cannot read a client profile', adminProfile.status() === 403,
    String(adminProfile.status()));

  await page.close();
}

/* ------------------------------------------------------ client signs in */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#username', clientCreds.username);
  await page.fill('#password', clientCreds.password);
  await page.click('button[type=submit]');
  await page.waitForURL('**/profile', { timeout: 10000 }).catch(() => {});
  check('a new client lands on profile setup', new URL(page.url()).pathname === '/profile',
    new URL(page.url()).pathname);

  const profileLabels = await page.locator('form label').allTextContents();
  check('profile setup contains every requested field',
    ['Preferred name', 'Legal name', 'Date of birth', 'Phone number', 'Residential address', 'Mailing address']
      .every((label) => profileLabels.some((value) => value.includes(label))),
    JSON.stringify(profileLabels));
  check('profile submit starts disabled',
    await page.getByRole('button', { name: 'Continue to dashboard' }).isDisabled());

  const invalidProfile = await page.request.post(BASE + '/api/auth/profile', { data: {} });
  const invalidProfileBody = await invalidProfile.json();
  check('profile API validates every required field',
    invalidProfile.status() === 400 &&
      Object.keys(invalidProfileBody.errors ?? {}).length === 6,
    String(invalidProfile.status()));

  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  check('an incomplete client cannot skip profile setup',
    new URL(page.url()).pathname === '/profile', new URL(page.url()).pathname);

  await page.fill('#preferredName', 'Client Principal');
  await page.fill('#legalName', 'Client Test');
  await page.fill('#dateOfBirth', '1990-06-15');
  await page.fill('#phoneNumber', '+33 6 12 34 56 78');
  await page.fill('#residentialAddress', '12 Rue de Rivoli\n75001 Paris\nFrance');
  await page.getByRole('checkbox', { name: /Mailing address is the same/ }).check();
  check('profile submit enables when required information is valid',
    await page.getByRole('button', { name: 'Continue to dashboard' }).isEnabled());
  await page.getByRole('button', { name: 'Continue to dashboard' }).click();
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  check('profile completion leads to the dashboard',
    new URL(page.url()).pathname === '/dashboard', new URL(page.url()).pathname);

  const body = await page.evaluate(() => document.body.innerText);
  check('client dashboard shows the complete preferred name', /Bonjour, Client Principal/.test(body));
  check('client is not offered an admin link',
    await page.locator('a[href="/admin"]:visible').count() === 0);
  await page.getByRole('button', { name: /Account menu for/ }).click();
  check('completed clients can reopen their profile',
    await page.locator('a[href="/profile"]:visible').count() >= 1);

  const savedProfile = await (await page.request.get(BASE + '/api/auth/profile')).json();
  check('client profile is persisted',
    savedProfile.complete === true &&
      savedProfile.profile.legalName === 'Client Test' &&
      savedProfile.profile.mailingAddress === savedProfile.profile.residentialAddress);

  await page.request.post(BASE + '/api/auth/logout');
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#username', clientCreds.username);
  await page.fill('#password', clientCreds.password);
  await page.click('button[type=submit]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  check('a completed client reconnects directly to the dashboard',
    new URL(page.url()).pathname === '/dashboard', new URL(page.url()).pathname);

  await page.goto(BASE + '/admin', { waitUntil: 'networkidle' });
  const clientAdminUrl = new URL(page.url());
  check('client is sent to the isolated admin sign-in',
    clientAdminUrl.hostname === 'admin.localhost' && clientAdminUrl.pathname === '/login',
    page.url());

  const api = await page.request.get(BASE + '/api/admin/config');
  check('client is refused by the admin API', api.status() === 403, String(api.status()));

  const users = await page.request.get(BASE + '/api/admin/users');
  check('client cannot list accesses', users.status() === 403);

  const scoped = await (await page.request.get(BASE + '/api/session/config')).json();
  check('client config is scoped to their accounts',
    scoped.config.accounts.length === 1, `n=${scoped.config.accounts.length}`);
  check('client identity is reported', scoped.user.role === 'client');
  check('client identity reports completed onboarding', scoped.user.profileComplete === true);

  await ctx.close();
}

/* ------------------------------------------------- disabling locks out */
{
  const page = await adminCtx.newPage();
  const users = await (await page.request.get(BASE + '/api/admin/users')).json();
  const client = users.find((u) => u.username === clientCreds.username);
  await page.request.patch(BASE + `/api/admin/users/${client.id}`, { data: { disabled: true } });

  const ctx = await browser.newContext();
  const p2 = await ctx.newPage();
  const res = await p2.request.post(BASE + '/api/auth/login', { data: clientCreds });
  check('a disabled access cannot sign in', res.status() === 401, String(res.status()));
  await ctx.close();

  await page.request.delete(BASE + `/api/admin/users/${client.id}`);
  await page.close();
}

/* --------------------------------------------------------------- logout */
{
  const page = await adminCtx.newPage();
  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  await page.request.post(BASE + '/api/auth/logout');
  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  check('logout ends the session', new URL(page.url()).pathname === '/login');
  await page.close();
}

await adminCtx.close();
console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall auth checks passed');
await browser.close();
process.exit(fails.length ? 1 : 0);
