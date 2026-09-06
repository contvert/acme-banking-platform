'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ds/Icon';
import { CURRENCIES, type Currency } from '@/lib/config/types';
import { checkBic, checkIban, formatIban, normaliseIban } from '@/lib/config/iban';
import p from '@/components/ds/Page.module.css';
import s from './RecipientForm.module.css';
import { useT } from '@/components/i18n/I18nProvider';

type FieldName = 'name' | 'iban' | 'bic' | 'bankName' | 'currency';
type Errors = Partial<Record<FieldName, string>>;

function FormField({
  id,
  label,
  helper,
  error,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  helper: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const tr = useT();
  const describedBy = `${id}-helper${error ? ` ${id}-error` : ''}`;
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={id}>
        {label}
        {optional && <span className={s.optional}>{tr('Optional')}</span>}
      </label>
      <div data-described-by={describedBy}>{children}</div>
      <p id={`${id}-helper`} className={s.helper}>{helper}</p>
      {error && <p id={`${id}-error`} className={s.fieldError} role="alert">{error}</p>}
    </div>
  );
}

export function RecipientForm() {
  const tr = useT();
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [bankName, setBankName] = useState('');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ibanCheck = useMemo(() => checkIban(iban), [iban]);
  const bicCheck = useMemo(() => checkBic(bic), [bic]);
  const localErrors: Errors = {
    name: name.trim().length >= 2 ? undefined : tr('Enter the beneficiary account holder.'),
    iban: ibanCheck.valid
      ? undefined
      : tr(ibanCheck.reason ?? 'Enter a valid IBAN.', ibanCheck.reasonValues),
    bic: bic.trim() && bicCheck.valid
      ? undefined
      : tr(bicCheck.reason ?? 'Enter a valid BIC / SWIFT code.'),
  };
  const valid = !localErrors.name && !localErrors.iban && !localErrors.bic && confirmed;

  const fieldError = (field: FieldName) =>
    serverErrors[field] ?? (touched[field] ? localErrors[field] : undefined);

  function updateField(field: FieldName, value: string, setter: (next: string) => void) {
    setter(value);
    setServerErrors((current) => ({ ...current, [field]: undefined }));
    setError(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ name: true, iban: true, bic: true, bankName: true, currency: true });
    if (!valid) return;

    setBusy(true);
    setError(null);
    setServerErrors({});

    try {
      const response = await fetch('/api/recipients', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, iban, bic, bankName, currency }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerErrors(body.errors ?? {});
        setError(body.error ?? 'Unable to save the recipient.');
        return;
      }

      window.location.replace(`/payments/recipients/${encodeURIComponent(body.recipient.id)}/verify`);
    } catch {
      setError('Unable to save the recipient. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <div className={s.intro}>
        <span className={s.introIcon}><Icon name="building-columns" size={18} /></span>
        <div>
          <h2>{tr('Beneficiary bank details')}</h2>
          <p>{tr('Save the RIB once, then select this recipient whenever you make a transfer.')}</p>
        </div>
      </div>

      {error && <div className={s.error} role="alert">{error}</div>}

      <FormField
        id="recipient-name"
        label={tr('Beneficiary name')}
        helper="Enter the account holder exactly as shown on the RIB."
        error={fieldError('name')}
      >
        <input
          id="recipient-name"
          className={s.input}
          autoComplete="name"
          value={name}
          onChange={(event) => updateField('name', event.target.value, setName)}
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
          aria-describedby={`recipient-name-helper${fieldError('name') ? ' recipient-name-error' : ''}`}
          aria-invalid={Boolean(fieldError('name'))}
          placeholder={tr('Company or person')}
          maxLength={120}
          required
        />
      </FormField>

      <FormField
        id="iban"
        label={tr('IBAN')}
        helper={iban && ibanCheck.valid ? `Valid ${ibanCheck.country ?? ''} IBAN.`.trim() : 'The check digits are verified before the RIB is saved.'}
        error={fieldError('iban')}
      >
        <input
          id="iban"
          className={s.input}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          value={iban}
          onChange={(event) => updateField('iban', event.target.value.toUpperCase(), setIban)}
          onBlur={() => {
            setTouched((current) => ({ ...current, iban: true }));
            if (iban) setIban(formatIban(iban));
          }}
          aria-describedby={`iban-helper${fieldError('iban') ? ' iban-error' : ''}`}
          aria-invalid={Boolean(fieldError('iban'))}
          placeholder="FR76 3000 6000 0112 3456 7890 189"
          maxLength={42}
          required
        />
      </FormField>

      <div className={s.grid}>
        <FormField
          id="bic"
          label={tr('BIC / SWIFT')}
          helper="Use the 8 or 11-character bank identifier shown on the RIB."
          error={fieldError('bic')}
        >
          <input
            id="bic"
            className={s.input}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            value={bic}
            onChange={(event) => updateField('bic', normaliseIban(event.target.value), setBic)}
            onBlur={() => setTouched((current) => ({ ...current, bic: true }))}
            aria-describedby={`bic-helper${fieldError('bic') ? ' bic-error' : ''}`}
            aria-invalid={Boolean(fieldError('bic'))}
            placeholder="AGRIFRPP"
            maxLength={11}
            required
          />
        </FormField>

        <FormField
          id="currency"
          label={tr('Currency')}
          helper="Transfers will be prepared in this currency."
          error={fieldError('currency')}
        >
          <select
            id="currency"
            className={s.input}
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
            aria-describedby="currency-helper"
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>{item.code} — {item.label}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField
        id="bank-name"
        label={tr('Bank name')}
        helper="Useful for recognizing the beneficiary later."
        error={fieldError('bankName')}
        optional
      >
        <input
          id="bank-name"
          className={s.input}
          autoComplete="organization"
          value={bankName}
          onChange={(event) => updateField('bankName', event.target.value, setBankName)}
          aria-describedby="bank-name-helper"
          placeholder={tr('Beneficiary bank')}
          maxLength={120}
        />
      </FormField>

      <div className={s.safety}>
        <Icon name="shield-check" size={18} />
        <p>{tr('Check the beneficiary name and IBAN carefully. A transfer sent to the wrong account may not be recoverable.')}</p>
      </div>

      <label className={s.confirm}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
        />
        <span>{tr('I have verified these bank details with the beneficiary.')}</span>
      </label>

      <div className={s.actions}>
        <Link className={p.btn} href="/payments/recipients">{tr('Cancel')}</Link>
        <button className={`${p.btn} ${p.btnPrimary}`} type="submit" disabled={!valid || busy}>
          {busy ? 'Sending code…' : 'Send verification code'}
        </button>
      </div>
    </form>
  );
}
