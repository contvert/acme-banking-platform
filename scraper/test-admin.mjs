/** Exercises the admin API and confirms the dashboard reflects each change. */
import { chromium } from 'playwright';
import { signIn, authedFetch } from './auth-helper.mjs';

const BASE = 'http://localhost:3210';
// Admin endpoints now require a session, so drive them through an authed fetch.
const request = await authedFetch(BASE);
const api = (path, init) => request('/api/admin' + path, init);

const fails = [];
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
  if (!cond) fails.push(name);
};

// ---- start from a known state -------------------------------------------
await api('/config', { method: 'DELETE' });
let config = await (await api('/config')).json();

check('reset leaves one account', config.accounts.length === 1, `n=${config.accounts.length}`);
check('seeded at 450 000', config.accounts[0].balance === 450000, String(config.accounts[0].balance));
check('seeded in EUR', config.defaultCurrency === 'EUR', config.defaultCurrency);
check('no history after reset',
  config.transactions.length === 0 && config.cards.length === 0 && config.notifications.length === 0);

// ---- collections round-trip ---------------------------------------------
const created = await (await api('/accounts', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Compte test', kind: 'savings', last4: '9911',
    balance: 1000, available: 900, pending: 100, currency: 'USD', status: 'active',
  }),
})).json();
check('POST creates and assigns an id', !!created.item?.id, created.item?.id);

const accId = created.item.id;
await api(`/accounts/${accId}`, { method: 'PATCH', body: JSON.stringify({ balance: 2500, status: 'restricted' }) });
config = await (await api('/config')).json();
const patched = config.accounts.find((a) => a.id === accId);
check('PATCH updates fields', patched.balance === 2500 && patched.status === 'restricted');
check('PATCH cannot rewrite the id', patched.id === accId);

const bogus = await api('/accounts/does-not-exist', { method: 'PATCH', body: JSON.stringify({ balance: 1 }) });
check('PATCH on a missing id is 404', bogus.status === 404, String(bogus.status));

const badCollection = await api('/wallets');
check('unknown collection is 404', badCollection.status === 404, String(badCollection.status));

// ---- transactions, cards, notifications, chat ---------------------------
const tx = await (await api('/transactions', {
  method: 'POST',
  body: JSON.stringify({
    date: '2026-09-01', party: 'Test SARL', amount: -320.5,
    accountId: 'acc-main', method: 'Virement', status: 'pending',
  }),
})).json();
const card = await (await api('/cards', {
  method: 'POST',
  body: JSON.stringify({
    holder: 'Jane Black', last4: '4242', label: 'Carte test', type: 'virtual',
    accountId: 'acc-main', status: 'active', spentThisMonth: 0, enabled: true,
  }),
})).json();
await api('/notifications', {
  method: 'POST',
  body: JSON.stringify({ title: 'Virement reçu', body: 'Test', level: 'success', createdAt: new Date().toISOString(), read: false }),
});
await api('/chat', {
  method: 'POST',
  body: JSON.stringify({ author: 'Support', body: 'Bonjour', at: new Date().toISOString(), fromTeam: true }),
});

await api(`/cards/${card.item.id}`, { method: 'PATCH', body: JSON.stringify({ enabled: false, status: 'frozen' }) });
config = await (await api('/config')).json();
const frozen = config.cards.find((c) => c.id === card.item.id);
check('card can be disabled and re-statused', frozen.enabled === false && frozen.status === 'frozen');

// ---- top-level patches ---------------------------------------------------
await api('/config', {
  method: 'PATCH',
  body: JSON.stringify({ company: { name: 'Testco' }, sections: { transactions: false } }),
});
config = await (await api('/config')).json();
check('company patch applies', config.company.name === 'Testco', config.company.name);
check('section flag applies', config.sections.transactions === false);
check('patch leaves other company fields alone', !!config.company.legalName);

// ---- the dashboard reflects it ------------------------------------------
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
await signIn(page.context());
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).split('\n')[0].slice(0, 140)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });

await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
let body = await page.evaluate(() => document.body.innerText);

check('renamed company shows', body.includes('Testco'));
check('hidden section is gone', !body.includes('Test SARL'), 'transactions were switched off');
check('EUR formatting used', /450\s?000,00\s?€/.test(body.replace(/ | /g, ' ')));

// switch transactions back on and confirm it returns
await api('/config', { method: 'PATCH', body: JSON.stringify({ sections: { transactions: true } }) });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(400);
body = await page.evaluate(() => document.body.innerText);
check('section toggles back on', body.includes('Test SARL'));
check('per-account currency respected', body.includes('$') || body.includes('US'), 'USD account listed');

// ---- admin page drives the same store ------------------------------------
await page.goto(BASE + '/admin', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const tabs = await page.evaluate(() =>
  [...document.querySelectorAll('[role="tab"]')].map((t) => t.textContent.trim().replace(/\d+$/, '').trim()));
check('admin exposes every area',
  ['Comptes', 'Cartes', 'Transactions', 'Notifications', 'Messagerie', 'Entreprise', 'Sections', 'Devise', 'Réinitialiser']
    .every((t) => tabs.some((x) => x.startsWith(t))),
  JSON.stringify(tabs));

check('no console errors', errs.length === 0, errs.slice(0, 2).join(' | '));

// ---- leave a clean store behind ------------------------------------------
await api('/config', { method: 'DELETE' });

console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall admin checks passed');
await browser.close();
process.exit(fails.length ? 1 : 0);
