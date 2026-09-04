/** Bank details: admin CRUD, primary exclusivity, IBAN validation, deposit rendering. */
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

const get = async () => (await api('/config')).json();

await api('/config', { method: 'DELETE' });
let config = await get();

check('seeded with one RIB', config.bankDetails.length === 1, `n=${config.bankDetails.length}`);
check('seed is primary', config.bankDetails[0].primary === true);

// --- create -------------------------------------------------------------
const second = await (await api('/bankDetails', {
  method: 'POST',
  body: JSON.stringify({
    label: 'Compte secondaire', holder: 'Acme, Incorporated',
    iban: 'DE89370400440532013000', bic: 'COBADEFF',
    bankName: 'Zweite Bank', bankAddress: 'Berlin', currency: 'EUR', primary: false,
  }),
})).json();
check('second RIB created', !!second.item?.id);

config = await get();
check('a new non-primary stays non-primary',
  config.bankDetails.filter((b) => b.primary).length === 1);

// --- primary exclusivity -------------------------------------------------
await api(`/bankDetails/${second.item.id}`, { method: 'PATCH', body: JSON.stringify({ primary: true }) });
config = await get();
const primaries = config.bankDetails.filter((b) => b.primary);
check('setting a primary clears it from the other', primaries.length === 1, `n=${primaries.length}`);
check('the right one is primary', primaries[0].id === second.item.id);

// --- delete promotes ------------------------------------------------------
await api(`/bankDetails/${second.item.id}`, { method: 'DELETE' });
config = await get();
check('deleting the primary promotes another',
  config.bankDetails.length === 1 && config.bankDetails[0].primary === true);

// --- IBAN check-digit logic ----------------------------------------------
const { checkIban } = await import('../lib/config/iban.ts').catch(() => ({ checkIban: null }));
if (checkIban) {
  check('valid FR IBAN passes', checkIban('FR76 3000 6000 0112 3456 7890 189').valid);
  check('mutated IBAN fails', !checkIban('FR76 3000 6000 0112 3456 7890 188').valid);
} else {
  // Exercise it through the UI instead when the TS module cannot be imported directly.
  console.log('info  IBAN unit check skipped (TS import); covered through the UI below');
}

// --- the deposit page renders it ------------------------------------------
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
await signIn(page.context());
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).split('\n')[0].slice(0, 140)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });

await page.goto(BASE + '/add-funds', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
let body = await page.evaluate(() => document.body.innerText);
check('deposit shows the configured IBAN', body.includes('FR76 3000 6000 0112 3456 7890 189'), 'grouped in fours');
check('deposit shows the holder', body.includes('Acme, Incorporated'));

await page.goto(BASE + '/add-funds/wire', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

// the two-step rail, carried over from the flow this page replaces
const rail = await page.evaluate(() =>
  [...document.querySelectorAll('nav[aria-label="Étapes"] a')].map((a) => a.textContent.trim()));
check('wire page keeps its two-step rail',
  JSON.stringify(rail) === '["Choisir une méthode","Détails du paiement"]', JSON.stringify(rail));

const collapsed = await page.evaluate(() => document.body.innerText);
check('sections start collapsed', !collapsed.includes('AGRIFRPP'));

const sections = await page.evaluate(() =>
  [...document.querySelectorAll('button[aria-expanded]')].map((b) => b.textContent.trim()));
check('both wire sections present',
  sections.some((x) => /national/i.test(x)) && sections.some((x) => /international/i.test(x)),
  JSON.stringify(sections));

await page.getByRole('button', { name: /Virement national/i }).click();
await page.waitForTimeout(300);
body = await page.evaluate(() => document.body.innerText);
check('wire page reveals the configured IBAN', body.includes('FR76 3000 6000 0112 3456 7890 189'));
check('wire page reveals the BIC', body.includes('AGRIFRPP'));

// Back returns to the method step
await page.getByRole('link', { name: /Retour/ }).click();
await page.waitForURL('**/add-funds', { timeout: 10000 }).catch(() => {});
check('Retour returns to /add-funds', new URL(page.url()).pathname === '/add-funds');

// --- editing in admin flows through to the deposit page -------------------
await api(`/bankDetails/${config.bankDetails[0].id}`, {
  method: 'PATCH',
  body: JSON.stringify({ iban: 'DE89370400440532013000', bic: 'COBADEFF', label: 'Compte modifié' }),
});
await page.goto(BASE + '/add-funds', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
body = await page.evaluate(() => document.body.innerText);
check('edit propagates to the deposit page', body.includes('DE89 3704 0044 0532 0130 00'));
check('old IBAN is gone', !body.includes('FR76 3000'));

// --- admin surface --------------------------------------------------------
await page.goto(BASE + '/admin', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.getByRole('tab', { name: /Coordonnées bancaires/ }).click();
await page.waitForTimeout(300);
body = await page.evaluate(() => document.body.innerText);
check('admin lists the RIB', body.includes('Compte modifié'));
check('admin marks the primary', body.includes('principal'));

// live IBAN validation in the form
const ibanInput = page.locator('input[placeholder^="FR76"]');
await ibanInput.fill('FR7630006000011234567890188');
await page.waitForTimeout(250);
body = await page.evaluate(() => document.body.innerText);
check('invalid IBAN is reported', /Clé de contrôle invalide/.test(body));
await ibanInput.fill('FR7630006000011234567890189');
await page.waitForTimeout(250);
body = await page.evaluate(() => document.body.innerText);
check('valid IBAN is accepted', /IBAN valide/.test(body));

check('no console errors', errs.length === 0, errs.slice(0, 2).join(' | '));

await api('/config', { method: 'DELETE' });
console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall RIB checks passed');
await browser.close();
process.exit(fails.length ? 1 : 0);
