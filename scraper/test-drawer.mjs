import { chromium } from 'playwright';
import { signIn } from './auth-helper.mjs';

const BASE = 'http://localhost:3210';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
await signIn(ctx);
const page = await ctx.newPage();

const fails = [];
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
  if (!cond) fails.push(name);
};

const railBox = () =>
  page.evaluate(() => {
    const nav = document.querySelector('nav');
    const r = nav.getBoundingClientRect();
    return { left: Math.round(r.left), onScreen: r.left > -10, visibility: getComputedStyle(nav).visibility };
  });

await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

let box = await railBox();
check('drawer starts off-canvas', !box.onScreen, JSON.stringify(box));

await page.getByRole('button', { name: 'Open menu' }).click();
await page.waitForTimeout(450);
box = await railBox();
check('opens on menu tap', box.onScreen && box.visibility === 'visible', JSON.stringify(box));
check('Open account is absent from the mobile drawer',
  await page.getByRole('link', { name: 'Open account', exact: true }).count() === 0);

const scrimVisible = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(
    (x) => getComputedStyle(x).position === 'fixed' && x.getBoundingClientRect().width >= window.innerWidth,
  );
  return b ? Number(getComputedStyle(b).opacity) > 0.1 : false;
});
check('scrim covers the page', scrimVisible);

const locked = await page.evaluate(() => document.body.style.overflow === 'hidden');
check('page scroll locked while open', locked);

await page.keyboard.press('Escape');
await page.waitForTimeout(450);
box = await railBox();
check('Escape closes', !box.onScreen, JSON.stringify(box));

// tapping the scrim closes
await page.getByRole('button', { name: 'Open menu' }).click();
await page.waitForTimeout(450);
await page.mouse.click(370, 500);
await page.waitForTimeout(450);
box = await railBox();
check('scrim tap closes', !box.onScreen, JSON.stringify(box));

// navigating closes the drawer and lands on the route
await page.getByRole('button', { name: 'Open menu' }).click();
await page.waitForTimeout(400);
await page.getByRole('link', { name: 'Transactions', exact: true }).click();
await page.waitForURL('**/transactions', { timeout: 10000 });
await page.waitForTimeout(500);
box = await railBox();
check('closes after navigation', !box.onScreen, `url=${new URL(page.url()).pathname}`);
check('body scroll restored', await page.evaluate(() => document.body.style.overflow !== 'hidden'));

// desktop keeps the persistent rail and drops the trigger
const desk = await ctx.newPage();
await desk.setViewportSize({ width: 1440, height: 900 });
await desk.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
await desk.waitForTimeout(300);
const deskState = await desk.evaluate(() => {
  const nav = document.querySelector('nav');
  const r = nav.getBoundingClientRect();
  const btn = document.querySelector('button[aria-label="Open menu"]');
  return {
    railLeft: Math.round(r.left),
    railWidth: Math.round(r.width),
    triggerShown: btn ? getComputedStyle(btn).display !== 'none' : false,
  };
});
check('desktop rail is persistent',
  deskState.railLeft === 0 && deskState.railWidth === 220, JSON.stringify(deskState));
check('desktop hides the menu trigger', !deskState.triggerShown);
check('Open account is absent from the desktop rail',
  await desk.getByRole('link', { name: 'Open account', exact: true }).count() === 0);
const devBadgeVisible = await desk.evaluate(() => {
  const root = document.querySelector('nextjs-portal')?.shadowRoot;
  if (!root) return false;
  return [...root.querySelectorAll('[data-next-badge-root], [data-next-badge]')]
    .some((element) => {
      const rect = element.getBoundingClientRect();
      return getComputedStyle(element).display !== 'none' && rect.width > 0 && rect.height > 0;
    });
});
check('the Next.js development badge is disabled', !devBadgeVisible);

console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nall drawer checks passed');
await browser.close();
process.exit(fails.length ? 1 : 0);
