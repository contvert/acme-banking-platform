'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CURRENCIES, type Currency, type AppConfig } from '@/lib/config/types';
import type { PublicUser } from '@/lib/auth/types';

interface ConfigState {
  config: AppConfig;
  /** Null when signed out. */
  user: PublicUser | null;
  isAdmin: boolean;
  /** Re-read from the server after an admin edit. */
  refresh: () => Promise<void>;
  /** Format an amount in a currency, defaulting to the config's. */
  money: (value: number, currency?: Currency) => string;
  symbol: (currency?: Currency) => string;
}

const Ctx = createContext<ConfigState | null>(null);

export function useConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useConfig must be used inside <ConfigProvider>');
  return ctx;
}

export function ConfigProvider({
  initial,
  user: initialUser,
  children,
}: {
  initial: AppConfig;
  user?: PublicUser | null;
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState(initial);
  const [user, setUser] = useState<PublicUser | null>(initialUser ?? null);

  const refresh = useCallback(async () => {
    // The session endpoint, not the admin one: a client may refresh too, and
    // gets the config scoped to their own accounts.
    const res = await fetch('/api/session/config', { cache: 'no-store' });
    if (res.ok) {
      const body = await res.json();
      setConfig(body.config);
      setUser(body.user ?? null);
    }
  }, []);

  const value = useMemo<ConfigState>(() => {
    const meta = (c?: Currency) =>
      CURRENCIES.find((x) => x.code === (c ?? config.defaultCurrency)) ?? CURRENCIES[0];

    return {
      config,
      user,
      isAdmin: user?.role === 'admin',
      refresh,
      symbol: (c) => meta(c).symbol,
      money: (value, c) => {
        const m = meta(c);
        return new Intl.NumberFormat(m.locale, {
          style: 'currency',
          currency: m.code,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      },
    };
  }, [config, user, refresh]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
