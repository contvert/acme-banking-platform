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
import { useT } from '@/components/i18n/I18nProvider';

const STEPS = [
  { label: 'Choose a method', href: '/add-funds' },
  { label: 'Payment details', href: '/add-funds/wire' },
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
  const tr = useT();
  const { config, isAdmin } = useConfig();
  const details = config.bankDetails ?? [];
  const [selectedId, setSelectedId] = useState<string>(
    details.find((d) => d.primary)?.id ?? details[0]?.id ?? '',
  );
  const rib: BankDetail | undefined = details.find((d) => d.id === selectedId) ?? details[0];

  return (
    <FlowLayout rail>
      <div className={s.layout}>
        <nav className={s.rail} aria-label={tr('Steps')}>
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
            <h1 className={s.title}>{tr('Payment details')}</h1>
          </header>

          <div className={s.notice}>
            <Icon name="circle-exclamation" size={15} />
            <span>
              {tr('Bank information')} : {tr('These details are the ones entered in the administration and match no real account.')}
            </span>
          </div>

          {!rib ? (
            <p style={{ fontSize: 16 }}>
              {tr('No bank details are registered.')}{' '}
              {isAdmin ? (
                <Link href="/admin" className={s.link}>{tr('Add one')}</Link>
              ) : (
                tr('Ask your administrator to add them.')
              )}
            </p>
          ) : (
            <>
              {details.length > 1 && (
                <Field label={tr('Account to credit')}>
                  <select
                    className={s.select}
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    aria-label={tr('Account to credit')}
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
                title={tr('Domestic Wire')}
                intro={tr('Use these details for a SEPA transfer to the account of {holder}.', { holder: rib.holder })}
              >
                <Row label={tr('Account holder')} value={rib.holder} />
                <Row label={tr('IBAN')} value={formatIban(rib.iban)} />
                {rib.bic && <Row label={tr('BIC / SWIFT')} value={rib.bic} />}
                <Row label={tr('Currency')} value={rib.currency} />
              </Section>

              <Section
                title={tr('International Wire')}
                intro="Pour un formulaire de virement, les libellés ci-dessous correspondent aux champs MT103."
              >
                <Row label={tr('BIC / SWIFT')} value={rib.bic || '—'} />
                <Row label={tr('IBAN')} value={formatIban(rib.iban)} />
                <Row label={tr('Bank')} value={rib.bankName || '—'} />
                {rib.bankAddress && <Row label={tr('Bank address')} value={rib.bankAddress} />}
                <Row label={tr('Beneficiary')} value={rib.holder} />
              </Section>

              <div className={f.actions}>
                <Link className={p.btn} href="/add-funds">
                  <Icon name="chevron-left" size={12} />{tr('Back')}</Link>
                {isAdmin && (
                  <Link className={`${p.btn} ${p.btnPrimary}`} href="/admin">
                    <Icon name="pencil" size={13} />{tr('Edit the details')}</Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </FlowLayout>
  );
}
