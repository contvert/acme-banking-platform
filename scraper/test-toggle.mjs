import { chromium } from 'playwright';
import { signIn } from './auth-helper.mjs';

const BASE = 'http://localhost:3210';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
await signIn(ctx);
const page = await ctx.newPage();

const fails = [];
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
  if (!cond) fails.push(name);
};

const themeState = () =>
  page.evaluate(() => ({
    attr: document.documentElement.getAttribute('data-theme'),
    scheme: document.documentElement.style.colorScheme,
    stored: (() => { try { return localStorage.getItem('acme-theme'); } catch { return null; } })(),
    bodyBg: getComputedStyle(document.body).backgroundColor,
  }));

await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });

// default: nothing stored, so system
let st = await themeState();
check('defaults to system', st.attr === null && st.stored === null, JSON.stringify(st));

async function pick(label) {
  await page.getByRole('button', { name: /^Theme:/ }).click();
  await page.getByRole('menuitemradio', { name: label }).click();
  await page.waitForTimeout(250);
}

await pick('Dark');
st = await themeState();
check('Dark applies + persists',
  st.attr === 'dark' && st.stored === 'dark' && st.scheme === 'dark', JSON.stringify(st));
const darkBg = st.bodyBg;

await pick('Light');
st = await themeState();
check('Light applies + persists',
  st.attr === 'light' && st.stored === 'light' && st.bodyBg !== darkBg, JSON.stringify(st));

await pick('System');
st = await themeState();
check('System clears the attribute',
  st.attr === null && st.stored === 'system' && st.scheme === 'light dark', JSON.stringify(st));

// persistence across a reload, and no flash of the wrong theme
await pick('Dark');
await page.reload({ waitUntil: 'domcontentloaded' });
const atPaint = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
check('survives reload with no flash', atPaint === 'dark', `data-theme at DOMContentLoaded=${atPaint}`);

// a second tab/page picks up the same stored choice
const page2 = await ctx.newPage();
await page2.goto(BASE + '/settings', { waitUntil: 'domcontentloaded' });
const other = await page2.evaluate(() => document.documentElement.getAttribute('data-theme'));
check('applies on other routes', other === 'dark', `data-theme=${other}`);

// keyboard dismissal
await page.getByRole('button', { name: /^Theme:/ }).click();
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
const menuGone = await page.evaluate(() => !document.querySelector('[role="menu"]'));
check('Escape closes the menu', menuGone);

console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall toggle checks passed');
await browser.close();
process.exit(fails.length ? 1 : 0);
