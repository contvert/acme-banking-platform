import { chromium } from 'playwright';
import { signIn, authedFetch } from './auth-helper.mjs';

const BASE = 'http://localhost:3210';

// Admin endpoints require a session.
const request = await authedFetch(BASE);
const api = (path, init) => request('/api/admin' + path, init);

// The cards list now renders the configured cards, so seed a known set first.
await api('/config', { method: 'DELETE' });
const accounts = await (await api('/accounts')).json();
const SEEDED = 3;
for (let i = 0; i < SEEDED; i++) {
  await api('/cards', {
    method: 'POST',
    body: JSON.stringify({
      holder: i === 0 ? 'Jane Black' : 'Alice Chen',
      last4: String(1000 + i),
      label: `Carte ${i + 1}`,
      type: i % 2 ? 'physical' : 'virtual',
      accountId: accounts[0].id,
      status: 'active',
      spentThisMonth: 100 * i,
      enabled: true,
    }),
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
await signIn(page.context());

const fails = [];
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
  if (!cond) fails.push(name);
};

const errs = [];
page.on('pageerror', (e) => errs.push(String(e).split('\n')[0].slice(0, 140)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });

const body = () => page.evaluate(() => document.body.innerText);

// ---------------- /cards ----------------
await page.goto(BASE + '/cards', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

// Presence is not enough — the header action must actually go somewhere.
const createCard = page.getByRole('link', { name: 'Create card' });
check('Create card is a link, not an inert button', (await createCard.count()) > 0);
await createCard.click();
await page.waitForURL('**/issue-card', { timeout: 10000 }).catch(() => {});
check('Create card navigates to /issue-card', new URL(page.url()).pathname === '/issue-card',
  `landed=${new URL(page.url()).pathname}`);
await page.goBack({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
check('Recommended callout present', (await body()).includes('Require receipts for card transactions over $75'));
check('Policies link present', (await page.getByRole('link', { name: 'Policies page' }).count()) > 0);

const tabs = await page.evaluate(() =>
  [...document.querySelectorAll('[role="tab"]')].map((t) => t.textContent.trim()));
check('Manage / Subscriptions tabs', JSON.stringify(tabs) === '["Manage","Subscriptions"]', JSON.stringify(tabs));

const headers = await page.evaluate(() =>
  [...document.querySelectorAll('thead th')].map((h) => h.textContent.trim()));
check('table columns match the original',
  JSON.stringify(headers) === JSON.stringify(['Cardholder', 'Card', 'Budgets', 'Spent this month', 'Type', 'Account']),
  JSON.stringify(headers));

const rows = await page.evaluate(() => document.querySelectorAll('tbody tr').length);
check('every configured card is listed', rows === SEEDED, `rows=${rows} seeded=${SEEDED}`);

// the policy toggle is interactive
const sw = page.getByRole('switch').first();
check('policy toggle starts off', (await sw.getAttribute('aria-checked')) === 'false');
await sw.click();
await page.waitForTimeout(200);
check('policy toggle flips', (await sw.getAttribute('aria-checked')) === 'true');

// Subscriptions tab switches content
await page.getByRole('tab', { name: 'Subscriptions' }).click();
await page.waitForTimeout(300);
check('Subscriptions tab switches', (await body()).includes('No card subscriptions'));

// ---------------- create-a-card flow ----------------
await page.goto(BASE + '/issue-card', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

const sections = await page.evaluate(() =>
  [...document.querySelectorAll('h2')].map((h) => h.textContent.trim()));
check('form sections match',
  JSON.stringify(sections) === JSON.stringify(['Basics', 'Type', 'Usage (optional)', 'Spend controls']),
  JSON.stringify(sections));

const submit = page.getByRole('button', { name: 'Create card' });
check('submit blocked before control type', await submit.isDisabled());
check('required hint shown', (await body()).includes('Please complete this field'));

// the note field only appears once a cardholder is picked
check('note hidden before cardholder', !(await body()).includes('characters remaining'));
await page.selectOption('#cardholder', 'Alice Chen');
await page.waitForTimeout(300);
check('note appears for the cardholder', (await body()).includes('Let Alice know how to use this card'));
check('character counter shown', (await body()).includes('140 characters remaining'));

await page.fill('#nickname', 'Team Travel Card');
await page.waitForTimeout(200);
check('preview tracks the nickname', (await body()).includes('Team Travel Card'));

// Existing budgets requires a budget before the form is valid
await page.selectOption('#control-type', 'Existing budgets');
await page.waitForTimeout(300);
check('budget picker appears', (await page.locator('#budget').count()) > 0);
check('still blocked without a budget', await submit.isDisabled());

await page.selectOption('#budget', 'Team Lunch');
await page.waitForTimeout(300);
check('submit enabled once complete', await submit.isEnabled());

await submit.click();
await page.waitForTimeout(600);

const done = await body();
check('reaches "You’re all set"', /You’re all set/.test(done));
check('confirmation copy', done.includes('Your card is activated and ready to use.') && done.includes('Go do great things.'));
check('card number masked with last4', done.includes('0330'));
check('Create another present', (await page.getByRole('button', { name: 'Create another' }).count()) > 0);

const viewDetails = page.getByRole('link', { name: 'View card details' });
check('View card details present', (await viewDetails.count()) > 0);

// Create another returns to an empty form
await page.getByRole('button', { name: 'Create another' }).click();
await page.waitForTimeout(400);
check('Create another resets the form',
  (await page.inputValue('#cardholder')) === '' && (await page.inputValue('#nickname')) === '');

// and the primary action leads to the cards list
await page.selectOption('#cardholder', 'Alice Chen');
await page.selectOption('#control-type', 'Spending limit');
await page.waitForTimeout(300);
check('Spending limit needs no budget', await page.getByRole('button', { name: 'Create card' }).isEnabled());
await page.getByRole('button', { name: 'Create card' }).click();
await page.waitForTimeout(500);
await page.getByRole('link', { name: 'View card details' }).click();
await page.waitForURL('**/cards', { timeout: 10000 });
check('View card details -> /cards', new URL(page.url()).pathname === '/cards');

check('no console errors', errs.length === 0, errs.slice(0, 2).join(' | '));

console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall card checks passed');
await browser.close();
process.exit(fails.length ? 1 : 0);
