/**
 * Recovery hatch: resets (or recreates) an admin from the terminal, for when
 * the password has been changed and lost.
 *
 *   node scripts/reset-admin.mjs [username] [password]
 */
import { promises as fs } from 'node:fs';
import { randomBytes, scrypt as scryptCb } from 'node:crypto';
import { promisify } from 'node:util';
import path from 'node:path';

const scrypt = promisify(scryptCb);
const FILE = path.join(process.cwd(), 'data', 'users.json');

const username = (process.argv[2] ?? 'admin').toLowerCase();
const password = process.argv[3] ?? randomBytes(9).toString('base64url');

const salt = randomBytes(16).toString('hex');
const passwordHash = ((await scrypt(password, salt, 64))).toString('hex');

let users = [];
try {
  users = JSON.parse(await fs.readFile(FILE, 'utf8'));
} catch {
  /* no file yet — we are creating the first admin */
}

const existing = users.findIndex((u) => u.username === username);
if (existing >= 0) {
  users[existing] = { ...users[existing], passwordHash, salt, role: 'admin', disabled: false };
  console.log(`Mot de passe réinitialisé pour « ${username} ».`);
} else {
  users.push({
    id: `usr-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`,
    username,
    displayName: 'Administrateur',
    role: 'admin',
    passwordHash,
    salt,
    accountIds: [],
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    disabled: false,
  });
  console.log(`Administrateur « ${username} » créé.`);
}

await fs.mkdir(path.dirname(FILE), { recursive: true });
await fs.writeFile(FILE, JSON.stringify(users, null, 2), 'utf8');

console.log(`\n  identifiant : ${username}`);
console.log(`  mot de passe : ${password}\n`);
