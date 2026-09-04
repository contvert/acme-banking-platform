import { chromium } from 'playwright';
import { signIn } from './auth-helper.mjs';

const BASE = 'http://localhost:3210';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
await signIn(page.context());

const fails = [];
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
  if (!cond) fails.push(name);
};

const errs = [];
page.on('pageerror', (e) => errs.push(String(e).split('\n')[0].slice(0, 140)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });

const trigger = () => page.getByRole('button', { name: 'Move money' });
const menuItems = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('[role="menuitem"]')].map((a) => a.textContent.trim()));

await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

check('trigger exists', (await trigger().count()) > 0);
check('starts closed', (await menuItems()).length === 0);

await trigger().click();
await page.waitForTimeout(300);

const items = await menuItems();
check('opens with the five actions',
  JSON.stringify(items) === JSON.stringify(['Send', 'Transfer', 'Deposit', 'Request', 'Upload bill']),
  JSON.stringify(items));

check('trigger reports expanded',
  (await page.getAttribute('button[aria-label="Move money"]', 'aria-expanded')) === 'true');

// Escape dismisses
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('Escape closes', (await menuItems()).length === 0);

// outside click dismisses
await trigger().click();
await page.waitForTimeout(300);
await page.mouse.click(300, 700);
await page.waitForTimeout(300);
check('outside click closes', (await menuItems()).length === 0);

// each entry navigates to a live route
const EXPECTED = {
  Send: '/send-money/pay/start',
  Transfer: '/send-money/transfer',
  Deposit: '/add-funds',
  Request: '/invoicing/create-invoice',
  'Upload bill': '/bill-pay',
};

for (const [label, href] of Object.entries(EXPECTED)) {
  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await trigger().click();
  await page.waitForTimeout(250);
  await page.getByRole('menuitem', { name: label, exact: true }).click();
  await page.waitForURL(`**${href}`, { timeout: 10000 }).catch(() => {});
  const landed = new URL(page.url()).pathname;
  const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim() ?? '');
  check(`${label} -> ${href}`, landed === href, `landed=${landed} h1="${h1}"`);
  check(`${label} closes the menu after navigating`, (await menuItems()).length === 0);
}

check('no console errors', errs.length === 0, errs.slice(0, 2).join(' | '));

console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall move-money checks passed');
await browser.close();
process.exit(fails.length ? 1 : 0);
