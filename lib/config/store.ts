import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { DEFAULT_CONFIG } from './defaults';
import type { AppConfig } from './types';

const FILE = path.join(process.cwd(), 'data', 'app-config.json');

/**
 * A JSON file rather than a database: the whole point is that an operator can
 * open it, read it, and see exactly what the application will show. Writes go through
 * a temp file and a rename so a crash mid-write cannot truncate the config.
 */
async function ensureDir() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
}

export async function readConfig(): Promise<AppConfig> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    // Merge over the defaults so a config written by an older version still
    // loads once new fields are added.
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      company: { ...DEFAULT_CONFIG.company, ...(parsed.company ?? {}) },
      sections: { ...DEFAULT_CONFIG.sections, ...(parsed.sections ?? {}) },
      accounts: parsed.accounts ?? DEFAULT_CONFIG.accounts,
      cards: parsed.cards ?? [],
      transactions: parsed.transactions ?? [],
      notifications: parsed.notifications ?? [],
      chat: parsed.chat ?? [],
      bankDetails: parsed.bankDetails ?? DEFAULT_CONFIG.bankDetails,
      // RIBs saved before OTP was introduced are deliberately put back into
      // verification: they must not become transferable without confirmation.
      recipients: (parsed.recipients ?? []).map((recipient) => ({
        ...recipient,
        verificationStatus: recipient.verificationStatus ?? 'pending',
        verifiedAt: recipient.verifiedAt ?? null,
      })),
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    throw err;
  }
}

export async function writeConfig(config: AppConfig): Promise<AppConfig> {
  await ensureDir();
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(config, null, 2), 'utf8');
  await fs.rename(tmp, FILE);
  return config;
}

/** Read, transform, write — the only way callers should mutate the config. */
export async function updateConfig(
  mutate: (config: AppConfig) => AppConfig | Promise<AppConfig>,
): Promise<AppConfig> {
  const current = await readConfig();
  const next = await mutate(structuredClone(current));
  return writeConfig(next);
}

export async function resetConfig(): Promise<AppConfig> {
  return writeConfig(structuredClone(DEFAULT_CONFIG));
}

export const CONFIG_PATH = FILE;
