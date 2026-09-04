'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { Field, fieldStyles as f } from '@/components/flow/Fields';
import { Icon } from '@/components/ds/Icon';
import { useConfig } from '@/components/config/ConfigProvider';
import { formatIban } from '@/lib/config/iban';
import p from '@/components/ds/Page.module.css';
import s from './AddFunds.module.css';

function CopyField({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={[s.copyField, wide && s.copyWide].filter(Boolean).join(' ')}>
      <label className={s.copyLabel}>{label}</label>
      <div className={s.copyRow}>
        <span className={s.copyValue}>{value}</span>
        <button
          className={s.copyBtn}
          type="button"
          aria-label={`Copier ${label}`}
          onClick={() => {
            navigator.clipboard?.writeText(value).catch(() => {});
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
        >
          <Icon name={copied ? 'check' : 'copy'} size={14} />
        </button>
      </div>
    </div>
  );
}

const METHODS = [
  { name: 'Virement SEPA', tag: 'Le plus courant', eta: 'Arrive en 1 jour ouvré.' },
  { name: 'Virement instantané', tag: 'Le plus rapide', eta: 'Arrive en quelques secondes.' },
  { name: 'Prélèvement', tag: null, eta: 'Arrive en 2 à 4 jours ouvrés.' },
];

export default function AddFundsPage() {
  const { config, money } = useConfig();
  const details = config.bankDetails ?? [];
  const [selectedId, setSelectedId] = useState<string>(
    details.find((d) => d.primary)?.id ?? details[0]?.id ?? '',
  );
  const rib = details.find((d) => d.id === selectedId) ?? details[0];
  const account = config.accounts.find((a) => a.currency === rib?.currency) ?? config.accounts[0];

  return (
    <FlowLayout title="Alimenter le compte">
      {!rib ? (
        <div className={f.card}>
          <p style={{ marginTop: 0, fontSize: 16 }}>
            Aucune coordonnée bancaire enregistrée.{' '}
            <Link href="/admin" className={s.link}>En ajouter dans l’administration</Link>.
          </p>
        </div>
      ) : (
        <>
          <div className={f.card}>
            {details.length > 1 && (
              <Field label="Coordonnées à afficher">
                <select
                  className={s.select}
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  aria-label="Coordonnées à afficher"
                >
                  {details.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}{d.primary ? ' — principal' : ''}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <div className={s.accountHead}>
              <div>
                <div className={s.accountName}>{rib.label}</div>
                <div className={s.accountMeta}>
                  {rib.holder}
                  {account ? ` · ${money(account.balance, account.currency)}` : ''}
                </div>
              </div>
              {rib.primary && <span className={s.primaryTag}>Principal</span>}
            </div>

            <div className={s.copyGrid}>
              <CopyField label="IBAN" value={formatIban(rib.iban)} wide />
              {rib.bic && <CopyField label="BIC / SWIFT" value={rib.bic} />}
              <CopyField label="Titulaire" value={rib.holder} />
              {rib.bankName && <CopyField label="Banque" value={rib.bankName} />}
            </div>

            {rib.bankAddress && (
              <p className={s.bankAddress}>{rib.bankAddress}</p>
            )}

            <div className={s.wireActions}>
              <Link className={`${p.btn} ${p.btnPrimary}`} href="/add-funds/wire">
                <Icon name="arrow-down-to-line" size={13} /> Instructions de virement
              </Link>
              <Link className={s.link} href="/admin">Modifier ces coordonnées</Link>
            </div>
          </div>

          <div className={s.methods}>
            {METHODS.map((m) => (
              <div key={m.name} className={s.method}>
                <span className={s.methodIcon}><Icon name="arrow-right-arrow-left" size={15} /></span>
                <span className={s.methodBody}>
                  <span className={s.methodName}>
                    {m.name}
                    {m.tag && <span className={s.methodTag}>{m.tag}</span>}
                  </span>
                  <span className={s.methodEta}>{m.eta}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </FlowLayout>
  );
}
