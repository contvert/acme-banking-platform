'use client';

import { useCallback, useState } from 'react';
import { useConfig } from '@/components/config/ConfigProvider';
import { useT } from '@/components/i18n/I18nProvider';
import type { CollectionName, AppConfig } from '@/lib/config/types';

/** Thin wrapper over the admin API that keeps the shared config in sync. */
export function useAdmin() {
  const { config, refresh } = useConfig();
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const call = useCallback(
    async (url: string, init: RequestInit, note: string) => {
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(url, {
          ...init,
          headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `${res.status} ${res.statusText}`);
        }
        await refresh();
        setSaved(note);
        window.setTimeout(() => setSaved(null), 2200);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        return false;
      } finally {
        setBusy(false);
      }
    },
    [refresh],
  );

  return {
    config,
    busy,
    error,
    saved,
    patchConfig: (patch: Partial<AppConfig>) =>
      call('/api/admin/config', { method: 'PATCH', body: JSON.stringify(patch) }, t('Saved')),
    create: (collection: CollectionName, item: Record<string, unknown>) =>
      call(`/api/admin/${collection}`, { method: 'POST', body: JSON.stringify(item) }, t('Added')),
    update: (collection: CollectionName, id: string, patch: Record<string, unknown>) =>
      call(`/api/admin/${collection}/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }, t('Updated')),
    remove: (collection: CollectionName, id: string) =>
      call(`/api/admin/${collection}/${id}`, { method: 'DELETE' }, t('Deleted')),
    reset: () => call('/api/admin/config', { method: 'DELETE' }, t('Reset done')),
  };
}
