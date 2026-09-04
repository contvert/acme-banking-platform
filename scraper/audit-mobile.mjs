import { chromium } from 'playwright';
import { signIn } from './auth-helper.mjs';
import { discoverRoutes } from './routes.mjs';

const BASE = 'http://localhost:3210';
const WIDTHS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
];
const DISCOVERED = discoverRoutes();
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : DISCOVERED;

const browser = await chromium.launch({ headless: true });

const summary = [];
const notClean = [];
for (const vp of WIDTHS) {
  console.log(`\n=== ${vp.name} ${vp.width}x${vp.height} ===`);
  let clean = 0;
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.width < 700,
    hasTouch: true,
  });

  await signIn(ctx);

  for (const route of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(400);

    // Does the viewport actually scroll under a real wheel? Programmatic
    // scrollTo succeeds even when html/body have become nested scroll
    // containers, so it has to be the wheel — that is the gesture that breaks.
    const needsScroll = await page.evaluate(() => {
      const de = document.documentElement;
      return de.scrollHeight > de.clientHeight + 1;
    });
    let scroll = { needed: needsScroll, works: true };
    if (needsScroll) {
      await page.mouse.move(vp.width / 2, vp.height / 2);
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(250);
      const moved = await page.evaluate(() =>
        Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop));
      scroll = { needed: true, works: moved > 0 };
      await page.evaluate(() => window.scrollTo(0, 0));
    }

    // Horizontal: `overflow-x: clip` leaves scrollWidth inflated even though the
    // page cannot pan, so measure the gesture. The geometric figure is kept
    // separately because it still tells us content is being cut off.
    await page.mouse.move(vp.width / 2, vp.height / 2);
    await page.mouse.wheel(400, 0);
    await page.waitForTimeout(200);
    const pans = await page.evaluate(() => {
      const x = Math.max(window.scrollX, document.documentElement.scrollLeft, document.body.scrollLeft);
      window.scrollTo(0, 0);
      return x > 0;
    });

    const m = await page.evaluate(() => {
      const de = document.documentElement;
      // elements sticking out past the viewport are what cause the page to pan
      const overflow = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > window.innerWidth + 1) {
          // Walk the whole ancestor chain: content wider than the viewport is
          // fine as long as *some* ancestor scrolls it horizontally.
          let n = el.parentElement;
          let scrollable = false;
          while (n && n !== document.documentElement) {
            const ox = getComputedStyle(n).overflowX;
            if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') { scrollable = true; break; }
            n = n.parentElement;
          }
          if (!scrollable) {
            overflow.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().slice(0, 40),
              right: Math.round(r.right),
              text: (el.textContent || '').trim().slice(0, 30),
            });
          }
        }
      }
      return {
        scrollW: de.scrollWidth,
        clientW: de.clientWidth,
        hOverflow: de.scrollWidth - de.clientWidth,
        sidebarVisible: (() => {
          const nav = document.querySelector('nav');
          if (!nav) return null;
          const r = nav.getBoundingClientRect();
          return r.width > 0 && r.right > 0;
        })(),
        // A drawer is off-canvas via transform, so measure where it actually sits.
        sidebarOnScreen: (() => {
          const nav = document.querySelector('nav');
          if (!nav) return false;
          const r = nav.getBoundingClientRect();
          return r.right > 0 && r.left < window.innerWidth;
        })(),
        sidebarWidth: Math.round(document.querySelector('nav')?.getBoundingClientRect().width ?? 0),
        menuButton: !!document.querySelector('button[aria-label="Open menu"]'),
        // Touch-size rules live behind `pointer: coarse`. On a hybrid device
        // Chromium reports `fine`, where desktop-sized targets are correct —
        // so only hold the 44px bar where the browser says the pointer is coarse.
        coarse: matchMedia('(pointer: coarse)').matches,
        smallTargets: (() => {
          let n = 0;
          for (const el of document.querySelectorAll('button, a[href], select, input')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            // A control inside a large <label> inherits that label's hit area.
            const lab = el.closest('label');
            if (lab && lab.getBoundingClientRect().height >= 40) continue;
            // WCAG 2.5.8 exempts a target that sits inline in a sentence, where
            // enlarging it would break the line box around it.
            if (getComputedStyle(el).display.startsWith('inline') && el.closest('p, li, dd, td')) continue;
            if (r.height < 40 || r.width < 24) n++;
          }
          return n;
        })(),
        overflow: overflow.slice(0, 5),
        overflowCount: overflow.length,
      };
    });

    if (ROUTES.length <= 6) {
      const slug = route.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'root';
      await page.screenshot({ path: `scraper/out/shots/_${vp.name}_${slug}.png`, fullPage: false });
    }

    console.log(
      `${m.hOverflow > 0 ? 'OVERFLOW' : 'ok      '} ${route.padEnd(18)} ` +
      `pan=${pans ? 'YES' : ' no'}  clipped=${String(m.hOverflow).padStart(3)}px  ` +
      `rail=${m.sidebarOnScreen ? 'visible' : 'off-canvas'}  ` +
      `menuBtn=${m.menuButton ? 'yes' : 'no '}  ` +
      `pointer=${m.coarse ? 'coarse' : 'fine  '}  ` +
      `smallTargets=${m.coarse ? String(m.smallTargets).padStart(3) : ' n/a'}  ` +
      `overflow=${m.overflowCount}  ` +
      `scroll=${!scroll.needed ? 'n/a ' : scroll.works ? 'ok  ' : 'STUCK'}`,
    );
    const targetsOk = !m.coarse || m.smallTargets === 0;
    // Cut-off content is a defect too, even when the page cannot be panned to it.
    const routeClean = !pans && m.hOverflow === 0 && m.overflowCount === 0 && targetsOk && scroll.works;
    if (routeClean) clean++;
    else notClean.push(
      `${vp.name} ${route}: ${pans ? 'PANS ' : ''}clipped=${m.hOverflow} overflow=${m.overflowCount} ` +
      `smallTargets=${m.smallTargets}${scroll.works ? '' : ' VERTICAL SCROLL STUCK'}`,
    );
    for (const o of m.overflow) {
      console.log(`    ${o.tag}.${o.cls} right=${o.right} "${o.text}"`);
    }
    await page.close();
  }
  summary.push(`${vp.name}: ${clean}/${ROUTES.length} clean`);
  await ctx.close();
}
console.log('\n' + summary.join('   |   '));
if (notClean.length) {
  console.log('\nNOT CLEAN:');
  notClean.forEach((n) => console.log('  ' + n));
}

await browser.close();
