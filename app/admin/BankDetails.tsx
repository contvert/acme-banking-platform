'use client';

import { useState } from 'react';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { CURRENCIES, type Currency } from '@/lib/config/types';
import { checkIban, checkBic, formatIban, normaliseIban } from '@/lib/config/iban';
import type { useAdmin } from './useAdmin';
import p from '@/components/ds/Page.module.css';
import s from './Admin.module.css';

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
          {editing ? 'Modifier les coordonnées' : 'Ajouter des coordonnées bancaires'}
        </h2>

        <div className={`${s.grid} ${s.grid2}`}>
          <Field label="Libellé interne">
            <input className={s.input} value={draft.label} placeholder="Compte courant"
              onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          </Field>
          <Field label="Titulaire du compte">
            <input className={s.input} value={draft.holder} placeholder="Raison sociale"
              onChange={(e) => setDraft({ ...draft, holder: e.target.value })} />
          </Field>
        </div>

        <div style={{ marginTop: 16 }}>
          <Field
            label="IBAN"
            hint={
              !draft.iban
                ? 'Vérifié par la clé de contrôle mod-97 (ISO 7064).'
                : ibanCheck.valid
                  ? `IBAN valide${ibanCheck.country ? ` (${ibanCheck.country})` : ''}`
                  : ibanCheck.reason
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
          <Field label="BIC / SWIFT" hint={draft.bic && !bicCheck.valid ? bicCheck.reason : '8 ou 11 caractères'}>
            <input className={s.input} value={draft.bic} placeholder="AGRIFRPP"
              aria-invalid={!!draft.bic && !bicCheck.valid}
              onChange={(e) => setDraft({ ...draft, bic: e.target.value.toUpperCase() })} />
          </Field>
          <Field label="Banque">
            <input className={s.input} value={draft.bankName} placeholder="Nom de la banque"
              onChange={(e) => setDraft({ ...draft, bankName: e.target.value })} />
          </Field>
          <Field label="Devise">
            <select className={s.select} value={draft.currency}
              onChange={(e) => setDraft({ ...draft, currency: e.target.value as Currency })}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ marginTop: 16 }}>
          <Field label="Adresse de la banque">
            <input className={s.input} value={draft.bankAddress} placeholder="1 rue de la Banque, 75002 Paris"
              onChange={(e) => setDraft({ ...draft, bankAddress: e.target.value })} />
          </Field>
        </div>

        <div className={p.headActions} style={{ marginTop: 20 }}>
          {editing && (
            <button className={p.btn} type="button" onClick={() => { setDraft(EMPTY); setEditing(null); }}>
              Annuler
            </button>
          )}
          <button className={`${p.btn} ${p.btnPrimary}`} type="button" disabled={admin.busy || !canSave} onClick={save}>
            <Icon name={editing ? 'check' : 'plus'} size={13} />
            {editing ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </Card>

      <Card>
        {list.length === 0 && <p className={s.empty}>Aucune coordonnée enregistrée.</p>}
        {list.map((b) => (
          <div key={b.id} className={s.row}>
            <div className={s.rowMain}>
              <div className={s.rowTitle}>
                {b.label}
                {b.primary && <span className={s.tabCount} style={{ marginLeft: 8 }}>principal</span>}
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
              >
                Définir comme principal
              </button>
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
              <Icon name="pencil" size={13} /> Modifier
            </button>
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
