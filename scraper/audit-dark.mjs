import { chromium } from 'playwright';
import { signIn } from './auth-helper.mjs';
import { discoverRoutes } from './routes.mjs';

const BASE = 'http://localhost:3210';
const THEME = process.env.THEME || 'dark';

const ROUTES = discoverRoutes();

/** WCAG relative luminance from an rgb() string. */
function luminance(rgb) {
  const m = rgb.match(/\d+(\.\d+)?/g);
  if (!m) return null;
  const [r, g, b] = m.slice(0, 3).map(Number).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  if (a == null || b == null) return null;
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const browser = await chromium.launch({ headless: true });
let clean = 0;
const findings = [];

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await ctx.addInitScript((t) => {
    try { localStorage.setItem('acme-theme', t); } catch {}
  }, THEME);

  await signIn(ctx);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).split('\n')[0].slice(0, 120)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 120)); });

  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(500);

    // Collect every visible text leaf with its resolved fg/bg pair.
    const samples = await page.evaluate(() => {
      function parse(c) {
        const m = (c || '').match(/[\d.]+/g);
        if (!m) return null;
        return { r: +m[0], g: +m[1], b: +m[2], a: m.length > 3 ? +m[3] : 1 };
      }
      /** Composite the stack of (possibly translucent) backgrounds behind an element. */
      function effectiveBg(el) {
        const layers = [];
        let n = el;
        while (n) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c && c.a > 0) layers.push(c);
          if (c && c.a === 1) break;
          n = n.parentElement;
        }
        const base = parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
        if (!layers.length || layers[layers.length - 1].a < 1) layers.push(base);
        // paint back-to-front
        let out = layers[layers.length - 1];
        for (let i = layers.length - 2; i >= 0; i--) {
          const top = layers[i];
          out = {
            r: top.r * top.a + out.r * (1 - top.a),
            g: top.g * top.a + out.g * (1 - top.a),
            b: top.b * top.a + out.b * (1 - top.a),
            a: 1,
          };
        }
        return `rgb(${Math.round(out.r)}, ${Math.round(out.g)}, ${Math.round(out.b)})`;
      }
      const out = [];
      for (const el of document.querySelectorAll('*')) {
        if (el.children.length) continue;
        const text = (el.textContent || '').trim();
        if (text.length < 2) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
        out.push({ text: text.slice(0, 40), fg: cs.color, bg: effectiveBg(el), size: cs.fontSize });
      }
      return out;
    });

    const bad = [];
    for (const s of samples) {
      const c = contrast(s.fg, s.bg);
      if (c != null && c < 2.0) bad.push({ ...s, ratio: c.toFixed(2) });
    }

    const ok = errs.length === 0 && bad.length === 0;
    if (ok) clean++;
    else findings.push({ route, errs, bad: bad.slice(0, 4) });

    console.log(
      `${ok ? 'ok  ' : 'WARN'} ${route.padEnd(42)} samples=${String(samples.length).padStart(4)}` +
      (errs.length ? ` ERR:${errs.length}` : '') +
      (bad.length ? ` LOW-CONTRAST:${bad.length}` : ''),
    );
  } catch (e) {
    findings.push({ route, errs: [String(e).split('\n')[0].slice(0, 120)], bad: [] });
    console.log(`FAIL ${route.padEnd(42)} ${String(e).split('\n')[0].slice(0, 70)}`);
  }
  await ctx.close();
}

console.log(`\n[${THEME}] ${clean}/${ROUTES.length} routes clean`);
if (findings.length) {
  console.log('\nFINDINGS:');
  for (const f of findings) {
    console.log(' ', f.route);
    f.errs.forEach((e) => console.log('    error:', e));
    f.bad.forEach((b) => console.log(`    contrast ${b.ratio}:1  "${b.text}"  ${b.fg} on ${b.bg} @${b.size}`));
  }
}
await browser.close();
