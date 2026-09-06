/**
 * Triggers the delayed-credentials dispatcher.
 *
 * Run this on a schedule (Windows Task Scheduler / cron) while the Next.js
 * server is up; it simply calls the dispatch endpoint with the shared bearer
 * secret, and the server does the sending. Reads the same environment the app
 * does, so PROVISIONING_SHARED_SECRET set in the shell (or .env.local, if you
 * export it) is enough.
 *
 *   node scripts/dispatch-provisioning.mjs
 *
 * Optional environment:
 *   PROVISIONING_DISPATCH_URL  default http://localhost:3210/api/provisioning/dispatch
 *   PROVISIONING_SHARED_SECRET required
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * A standalone node script — unlike the app — does not get .env.local loaded
 * for it, so read the few values we need from there when they are not already
 * in the environment. This lets a bare `node scripts/dispatch-provisioning.mjs`
 * from a scheduled task find the shared secret without any extra wiring.
 */
function loadDotEnv() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  for (const name of ['.env.local', '.env']) {
    let raw;
    try {
      raw = readFileSync(path.join(root, name), 'utf8');
    } catch {
      continue;
    }
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m || line.trimStart().startsWith('#')) continue;
      const key = m[1];
      let value = m[2].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

loadDotEnv();

const url =
  process.env.PROVISIONING_DISPATCH_URL?.trim() ||
  'http://localhost:3210/api/provisioning/dispatch';
const secret = process.env.PROVISIONING_SHARED_SECRET?.trim();

if (!secret) {
  console.error('PROVISIONING_SHARED_SECRET is not set.');
  process.exit(2);
}

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`Dispatch failed (${res.status}):`, body);
    process.exit(1);
  }
  console.log(`Dispatch ok:`, body);
} catch (err) {
  console.error('Dispatch could not reach the server:', err.message);
  process.exit(1);
}
