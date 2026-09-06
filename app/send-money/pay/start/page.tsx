'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { DropZone, Field, fieldStyles as f } from '@/components/flow/Fields';
import { Icon } from '@/components/ds/Icon';
import { RECENTLY_PAID } from '@/lib/mock/payFlow';
import p from '@/components/ds/Page.module.css';
import s from './PayStart.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export default function PayStartPage() {
  const tr = useT();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RECENTLY_PAID;
    return RECENTLY_PAID.filter(
      (r) => r.name.toLowerCase().includes(q)
        || (r.role ?? '').toLowerCase().includes(q)
        || (r.email ?? '').toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <FlowLayout title={tr('How would you like to start?')} wide>
      <h2 className={s.sectionTitle}>{tr('Upload a bill')}</h2>
      <p className={s.sectionHint}>
        Use this to automatically pre-fill your recipient&rsquo;s payment details.
      </p>
      <DropZone hint={tr('Upload images, PDFs, or spreadsheets')} />

      <div className={f.divider}>{tr('OR')}</div>

      <h2 className={s.sectionTitle}>{tr('Select a recipient')}</h2>
      <Field label={tr('Search')}>
        <input
          className={s.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={tr('Search recipients')}
        />
      </Field>

      <div className={s.actionRow}>
        <Link className={p.btn} href="/payments/recipients/create">
          <Icon name="plus" size={13} />{tr('Create recipient')}</Link>
        <Link className={p.btn} href="/payments/recipients/create/request">
          <Icon name="envelope" size={13} />{tr('Invite recipient')}</Link>
      </div>

      <div className={s.listLabel}>{tr('Recently paid')}</div>
      <div className={s.list}>
        {results.map((r) => (
          <Link key={r.name} href="/send-money/pay/recipient-details" className={s.row}>
            <span className={s.avatar}>{r.initials}</span>
            <span className={s.rowBody}>
              <span className={s.rowName}>{r.name}</span>
              {(r.role || r.email) && (
                <span className={s.rowMeta}>
                  {r.role && <span className={s.rowRole}>{r.role}</span>}
                  {r.email && <span>{r.email}</span>}
                </span>
              )}
            </span>
            <Icon name="chevron-right" size={14} />
          </Link>
        ))}
        {results.length === 0 && (
          <div className={s.empty}>No recipients match &ldquo;{query}&rdquo;.</div>
        )}
      </div>
    </FlowLayout>
  );
}
