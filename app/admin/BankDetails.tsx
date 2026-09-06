'use client';

import { useState } from 'react';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { CURRENCIES, type Currency } from '@/lib/config/types';
import { checkIban, checkBic, formatIban, normaliseIban } from '@/lib/config/iban';
import type { useAdmin } from './useAdmin';
import p from '@/components/ds/Page.module.css';
import s from './Admin.module.css';
import { useT } from '@/components/i18n/I18nProvider';

type Admin = ReturnType<typeof useAdmin>;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={s.label}>{label}</label>
      {children}
      {hint && <div className={s.rowMeta} style={{ marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

const EMPTY = {
  label: '', holder: '', iban: '', bic: '',
  bankName: '', bankAddress: '', currency: 'EUR' as Currency,
};

export function BankDetailsPanel({ admin }: { admin: Admin }) {
  const tr = useT();
  const [draft, setDraft] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);

  const ibanCheck = draft.iban ? checkIban(draft.iban) : { valid: false };
  const bicCheck = checkBic(draft.bic);
  const canSave = draft.label.trim() && draft.holder.trim() && ibanCheck.valid && bicCheck.valid;

  const list = admin.config.bankDetails ?? [];

  async function save() {
    const payload = {
      ...draft,
      label: draft.label.trim(),
      holder: draft.holder.trim(),
      iban: normaliseIban(draft.iban),
      bic: normaliseIban(draft.bic),
    };
    const ok = editing
      ? await admin.update('bankDetails', editing, payload)
      : await admin.create('bankDetails', payload);
    if (ok) {
      setDraft(EMPTY);
      setEditing(null);
    }
  }

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 400, margin: '0 0 16px', color: 'var(--ds-text-emphasized)' }}>
          {editing ? tr('Edit the details') : tr('Add bank details')}
        </h2>

        <div className={`${s.grid} ${s.grid2}`}>
          <Field label={tr('Internal label')}>
            <input className={s.input} value={draft.label} placeholder={tr('Checking account')}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          </Field>
          <Field label={tr('Account holder')}>
            <input className={s.input} value={draft.holder} placeholder={tr('Legal name')}
              onChange={(e) => setDraft({ ...draft, holder: e.target.value })} />
          </Field>
        </div>

        <div style={{ marginTop: 16 }}>
          <Field
            label={tr('IBAN')}
            hint={
              !draft.iban
                ? tr('Checked with the mod-97 check digits (ISO 7064).')
                : ibanCheck.valid
                  ? ibanCheck.country
                    ? tr('Valid IBAN ({country})', { country: ibanCheck.country })
                    : tr('Valid IBAN')
                  : ibanCheck.reason
                    ? tr(ibanCheck.reason, ibanCheck.reasonValues)
                    : undefined
            }
          >
            <input
              className={s.input}
              value={draft.iban}
              placeholder="FR76 3000 6000 0112 3456 7890 189"
              aria-invalid={!!draft.iban && !ibanCheck.valid}
              style={draft.iban && !ibanCheck.valid ? { borderColor: 'var(--ds-border-input-error-underline)' } : undefined}
              onChange={(e) => setDraft({ ...draft, iban: e.target.value })}
              onBlur={(e) => setDraft((d) => ({ ...d, iban: formatIban(e.target.value) }))}
            />
          </Field>
        </div>

        <div className={`${s.grid} ${s.grid3}`} style={{ marginTop: 16 }}>
          <Field label={tr('BIC / SWIFT')} hint={
              draft.bic && !bicCheck.valid && bicCheck.reason
                ? tr(bicCheck.reason)
                : tr('8 or 11 characters')
            }>
            <input className={s.input} value={draft.bic} placeholder="AGRIFRPP"
              aria-invalid={!!draft.bic && !bicCheck.valid}
              onChange={(e) => setDraft({ ...draft, bic: e.target.value.toUpperCase() })} />
          </Field>
          <Field label={tr('Bank')}>
            <input className={s.input} value={draft.bankName} placeholder={tr('Bank name')}
              onChange={(e) => setDraft({ ...draft, bankName: e.target.value })} />
          </Field>
          <Field label={tr('Currency')}>
            <select className={s.select} value={draft.currency}
              onChange={(e) => setDraft({ ...draft, currency: e.target.value as Currency })}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ marginTop: 16 }}>
          <Field label={tr('Bank address')}>
            <input className={s.input} value={draft.bankAddress} placeholder="1 rue de la Banque, 75002 Paris"
              onChange={(e) => setDraft({ ...draft, bankAddress: e.target.value })} />
          </Field>
        </div>

        <div className={p.headActions} style={{ marginTop: 20 }}>
          {editing && (
            <button className={p.btn} type="button" onClick={() => { setDraft(EMPTY); setEditing(null); }}>{tr('Cancel')}</button>
          )}
          <button className={`${p.btn} ${p.btnPrimary}`} type="button" disabled={admin.busy || !canSave} onClick={save}>
            <Icon name={editing ? 'check' : 'plus'} size={13} />
            {editing ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </Card>

      <Card>
        {list.length === 0 && <p className={s.empty}>{tr('No bank details saved.')}</p>}
        {list.map((b) => (
          <div key={b.id} className={s.row}>
            <div className={s.rowMain}>
              <div className={s.rowTitle}>
                {b.label}
                {b.primary && <span className={s.tabCount} style={{ marginLeft: 8 }}>{tr('primary')}</span>}
              </div>
              <div className={s.rowMeta} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatIban(b.iban)}
              </div>
              <div className={s.rowMeta}>
                {b.holder} · {b.bic || '—'} · {b.bankName || '—'} · {b.currency}
              </div>
            </div>

            {!b.primary && (
              <button
                className={p.btn}
                type="button"
                onClick={() => admin.update('bankDetails', b.id, { primary: true })}
              >{tr('Set as primary')}</button>
            )}
            <button
              className={p.btn}
              type="button"
              onClick={() => {
                setEditing(b.id);
                setDraft({
                  label: b.label, holder: b.holder, iban: formatIban(b.iban), bic: b.bic,
                  bankName: b.bankName, bankAddress: b.bankAddress, currency: b.currency,
                });
              }}
            >
              <Icon name="pencil" size={13} />{tr('Edit')}</button>
            <button
              className={`${p.btn} ${s.danger}`}
              type="button"
              onClick={() => admin.remove('bankDetails', b.id)}
              aria-label={`Supprimer ${b.label}`}
            >
              <Icon name="trash-can" size={13} />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}
