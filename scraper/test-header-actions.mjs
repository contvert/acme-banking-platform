/** Click every header action that claims a destination and confirm it lands. */
import { chromium } from 'playwright';
import { signIn } from './auth-helper.mjs';
import { discoverRoutes } from './routes.mjs';

const BASE = 'http://localhost:3210';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
await signIn(ctx);

let checked = 0;
const bad = [];

for (const route of discoverRoutes()) {
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(250);

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('header a[href]')].map((a) => ({
      label: a.textContent.trim(),
      href: a.getAttribute('href'),
    })));

  for (const l of links) {
    const target = new URL(l.href, BASE);
    const res = await page.request.get(target.href).catch(() => null);
    const status = res ? res.status() : 0;
    checked++;
    if (status !== 200) bad.push({ route, ...l, status });
  }
  await page.close();
}

console.log(`${checked} header action links checked`);
if (bad.length) {
  console.log(`\n${bad.length} broken:`);
  bad.forEach((b) => console.log(`  ${b.route} — ${b.label} -> ${b.href} (HTTP ${b.status})`));
} else {
  console.log('all header action links resolve');
}
await browser.close();
process.exit(bad.length ? 1 : 0);
