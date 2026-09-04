import { chromium } from 'playwright';
import { signIn } from './auth-helper.mjs';
import { discoverRoutes } from './routes.mjs';

const BASE = 'http://localhost:3210';

const ROUTES = discoverRoutes();

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
await signIn(ctx);

let pass = 0;
const problems = [];

for (const route of ROUTES) {
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).split('\n')[0].slice(0, 160)));
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 160));
  });

  let status = 0;
  try {
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    status = res?.status() ?? 0;
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => ({
      text: (document.body.innerText || '').length,
      h1: document.querySelector('h1')?.textContent?.trim() ?? '(no h1)',
      rows: document.querySelectorAll('tbody tr').length,
    }));

    const ok = status === 200 && errs.length === 0 && info.text > 200;
    if (ok) pass++;
    else problems.push({ route, status, errs: errs.slice(0, 3), text: info.text });

    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${route.padEnd(32)} ${String(status).padEnd(4)} ` +
      `h1="${info.h1.slice(0, 24)}" text=${info.text} rows=${info.rows}` +
      (errs.length ? ` ERR:${errs.length}` : ''),
    );
  } catch (e) {
    problems.push({ route, status, errs: [String(e).split('\n')[0].slice(0, 160)] });
    console.log(`FAIL ${route.padEnd(32)} ${String(e).split('\n')[0].slice(0, 90)}`);
  }
  await page.close();
}

console.log(`\n${pass}/${ROUTES.length} routes clean`);
if (problems.length) {
  console.log('\nPROBLEMS:');
  for (const p of problems) {
    console.log(' ', p.route, p.status, JSON.stringify(p.errs));
  }
}
await browser.close();
