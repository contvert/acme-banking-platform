'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/locales';

/**
 * Records a language choice and re-renders from the server, which is where
 * the language is resolved. Shared by the two places the choice is offered:
 * the top bar on a wide screen, the account menu on a narrow one.
 */
export function useSetLocale() {
  const router = useRouter();
  const [saving, setSaving] = useState<Locale | null>(null);

  async function setLocale(next: Locale) {
    setSaving(next);
    try {
      const response = await fetch('/api/i18n', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale: next }),
      });
      if (!response.ok) return false;
      router.refresh();
      return true;
    } finally {
      setSaving(null);
    }
  }

  return { setLocale, saving };
}
