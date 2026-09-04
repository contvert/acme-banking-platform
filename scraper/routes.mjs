import fs from 'node:fs';
import path from 'node:path';

/** Sample values for dynamic segments, so every route is reachable in a test. */
const SAMPLES = {
  id: {
    'accounts/depository': 'party-bankid2',
    'accounts/treasury': 'party-treasury-id-0',
    'settings/users': 'team-id-2',
    transactions: 'debit-outgoing4-0',
  },
  tab: { default: 'statements' },
  rule: { default: 'paymentApprovals' },
  kind: { default: 'card-spend' },
  split: { default: 'money-in' },
  slug: { default: 'mock-nda-viewer-link-slug' },
};

/** Every route in app/, with dynamic segments filled in. */
export function discoverRoutes(root = 'app') {
  const out = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'page.tsx') {
        const rel = path.relative(root, dir).split(path.sep).filter(Boolean);
        const parts = [];
        for (let i = 0; i < rel.length; i++) {
          const seg = rel[i];
          const m = seg.match(/^\[(?:\.\.\.)?(\w+)\]$/);
          if (!m) { parts.push(seg); continue; }
          const table = SAMPLES[m[1]] || {};
          const parent = parts.join('/');
          parts.push(table[parent] ?? table.default ?? 'sample');
        }
        out.push('/' + parts.join('/'));
      }
    }
  })(root);
  return [...new Set(out)].sort();
}
