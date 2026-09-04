'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { Field, fieldStyles as f } from '@/components/flow/Fields';
import { Icon } from '@/components/ds/Icon';
import { useConfig } from '@/components/config/ConfigProvider';
import { formatIban } from '@/lib/config/iban';
import type { BankDetail } from '@/lib/config/types';
import p from '@/components/ds/Page.module.css';
import s from './Wire.module.css';

const STEPS = [
  { label: 'Choisir une méthode', href: '/add-funds' },
  { label: 'Détails du paiement', href: '/add-funds/wire' },
];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={s.row}>
      <dt className={s.rowLabel}>{label}</dt>
      <dd className={s.rowValue}>{value}</dd>
    </div>
  );
}

function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={s.section}>
      <button className={s.sectionHead} type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className={s.eyebrow}>{title}</span>
        <span className={[s.chev, open && s.chevOpen].filter(Boolean).join(' ')}>
          <Icon name="chevron-down" size={14} />
        </span>
      </button>
      {open && (
        <div className={s.sectionBody}>
          <p className={s.intro}>{intro}</p>
          <dl className={s.rows}>{children}</dl>
        </div>
      )}
    </div>
  );
}

export default function WireDetailsPage() {
  const { config } = useConfig();
  const details = config.bankDetails ?? [];
  const [selectedId, setSelectedId] = useState<string>(
    details.find((d) => d.primary)?.id ?? details[0]?.id ?? '',
  );
  const rib: BankDetail | undefined = details.find((d) => d.id === selectedId) ?? details[0];

  return (
    <FlowLayout rail>
      <div className={s.layout}>
        <nav className={s.rail} aria-label="Étapes">
          {STEPS.map((step, i) => (
            <Link
              key={step.label}
              href={step.href}
              className={[s.step, i === STEPS.length - 1 && s.stepActive].filter(Boolean).join(' ')}
            >
              {step.label}
            </Link>
          ))}
        </nav>

        <div className={s.main}>
          <header className={s.head}>
            <h1 className={s.title}>Détails du paiement</h1>
          </header>

          <div className={s.notice}>
            <Icon name="circle-exclamation" size={15} />
            <span>
              Informations bancaires : ces coordonnées sont celles saisies dans
              l’administration et ne correspondent à aucun compte réel.
            </span>
          </div>

          {!rib ? (
            <p style={{ fontSize: 16 }}>
              Aucune coordonnée enregistrée.{' '}
              <Link href="/admin" className={s.link}>En ajouter</Link>.
            </p>
          ) : (
            <>
              {details.length > 1 && (
                <Field label="Compte à créditer">
                  <select
                    className={s.select}
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    aria-label="Compte à créditer"
                  >
                    {details.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}{d.primary ? ' — principal' : ''}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Section
                title="Virement national"
                intro={`Utilisez ces informations pour un virement SEPA vers le compte de ${rib.holder}.`}
              >
                <Row label="Titulaire" value={rib.holder} />
                <Row label="IBAN" value={formatIban(rib.iban)} />
                {rib.bic && <Row label="BIC / SWIFT" value={rib.bic} />}
                <Row label="Devise" value={rib.currency} />
              </Section>

              <Section
                title="Virement international"
                intro="Pour un formulaire de virement, les libellés ci-dessous correspondent aux champs MT103."
              >
                <Row label="BIC / SWIFT" value={rib.bic || '—'} />
                <Row label="IBAN" value={formatIban(rib.iban)} />
                <Row label="Banque" value={rib.bankName || '—'} />
                {rib.bankAddress && <Row label="Adresse de la banque" value={rib.bankAddress} />}
                <Row label="Bénéficiaire" value={rib.holder} />
              </Section>

              <div className={f.actions}>
                <Link className={p.btn} href="/add-funds">
                  <Icon name="chevron-left" size={12} /> Retour
                </Link>
                <Link className={`${p.btn} ${p.btnPrimary}`} href="/admin">
                  <Icon name="pencil" size={13} /> Modifier les coordonnées
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </FlowLayout>
  );
}
