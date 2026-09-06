'use client';

import { useEffect, useMemo, useState } from 'react';
import { BRAND } from '@/lib/brand';
import {
  normalizeClientProfile,
  validateClientProfile,
  type ClientProfileDraft,
  type ClientProfileErrors,
} from '@/lib/auth/profile';
import s from './Profile.module.css';
import { useT } from '@/components/i18n/I18nProvider';

type FieldName = keyof ClientProfileDraft;
type Touched = Partial<Record<FieldName, boolean>>;

const FIELD_ORDER: FieldName[] = [
  'preferredName',
  'legalName',
  'dateOfBirth',
  'phoneNumber',
  'residentialAddress',
  'mailingAddress',
];

function FieldMessage({
  id,
  helper,
  error,
}: {
  id: string;
  helper: string;
  error?: string;
}) {
  return (
    <>
      <p className={s.helper} id={id + '-helper'}>{helper}</p>
      {error && <p className={s.fieldError} id={id + '-error'} role="alert">{error}</p>}
    </>
  );
}

export function ProfileForm({
  email,
  initialProfile,
  initialComplete,
  today,
}: {
  email: string;
  initialProfile: ClientProfileDraft;
  initialComplete: boolean;
  today: string;
}) {
  const tr = useT();
  const [form, setForm] = useState(initialProfile);
  const [sameAsResidential, setSameAsResidential] = useState(
    Boolean(
      initialProfile.residentialAddress &&
      initialProfile.residentialAddress === initialProfile.mailingAddress,
    ),
  );
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<ClientProfileErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Once the details are saved, the form hands over to a confirmation step.
  const [pending, setPending] = useState<{ destination: string } | null>(null);
  const [code, setCode] = useState('');
  const [resendIn, setResendIn] = useState(0);

  // Tick the resend cooldown down so the button says when it will work again.
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => setResendIn((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendIn > 0]);

  const effectiveProfile = useMemo(
    () =>
      normalizeClientProfile({
        ...form,
        mailingAddress: sameAsResidential ? form.residentialAddress : form.mailingAddress,
      }),
    [form, sameAsResidential],
  );
  const validation = useMemo(() => validateClientProfile(effectiveProfile), [effectiveProfile]);
  const canSubmit = Object.keys(validation).length === 0;

  const fieldError = (name: FieldName) =>
    touched[name] || submitted ? serverErrors[name] ?? validation[name] : undefined;

  function update(name: FieldName, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setServerErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function blur(name: FieldName) {
    setTouched((current) => ({ ...current, [name]: true }));
  }

  function focusFirstInvalid(errors: ClientProfileErrors) {
    const first = FIELD_ORDER.find((field) => errors[field]);
    if (first) window.requestAnimationFrame(() => document.getElementById(first)?.focus());
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);

    if (!canSubmit) {
      setError('Please review the highlighted fields.');
      focusFirstInvalid(validation);
      return;
    }

    setBusy(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(effectiveProfile),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        const nextErrors = body.errors ?? {};
        setServerErrors(nextErrors);
        setError(body.error ?? 'Unable to save your profile.');
        focusFirstInvalid(nextErrors);
        return;
      }

      if (body.status === 'verification-sent') {
        setPending({ destination: body.verification?.destination ?? tr('your address') });
        setResendIn(60);
        return;
      }

      // Already confirmed: rebuild the layout with the refreshed session.
      window.location.replace('/dashboard');
    } catch {
      setError('Unable to save your profile. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch('/api/auth/profile/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? 'Code incorrect.');
        setCode('');
        return;
      }
      window.location.replace('/dashboard');
    } catch {
      setError(tr('Could not confirm. Check your connection.'));
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setError(null);
    setBusy(true);
    try {
      const response = await fetch('/api/auth/profile/resend', { method: 'POST' });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? tr('Could not send.'));
        setResendIn(body.retryAfterSeconds ?? 60);
        return;
      }
      setResendIn(60);
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    window.location.replace('/login');
  }

  const preferredError = fieldError('preferredName');
  const legalError = fieldError('legalName');
  const birthError = fieldError('dateOfBirth');
  const phoneError = fieldError('phoneNumber');
  const residentialError = fieldError('residentialAddress');
  const mailingError = sameAsResidential ? undefined : fieldError('mailingAddress');

  const chrome = (
    <header className={s.header}>
      <div className={s.brand}>
        <img src="/logo.png" alt={BRAND.productName} className="logo-img" style={{ height: 28 }} />
      </div>
      <div className={s.account}>
        <span className={s.email}>{email}</span>
        <button className={s.signOut} type="button" onClick={signOut}>{tr('Sign out')}</button>
      </div>
    </header>
  );

  // Details are saved; the address now has to be confirmed before the profile
  // counts as complete.
  if (pending) {
    return (
      <div className={s.screen}>
        {chrome}
        <main className={s.main}>
          <div className={s.intro}>
            <div>
              <p className={s.eyebrow}>{tr('CONFIRMATION')}</p>
              <h1 className={s.title}>{tr('Confirm your email address')}</h1>
              <p className={s.lede}>
                {tr('A six-digit code has just been sent to {destination}. Enter it to finish your profile.', {
                  destination: pending.destination,
                })}
                <br /><br />
                <strong>{tr('Please check your spam folder if you do not see it in your inbox.')}</strong>
              </p>
            </div>
          </div>

          <form className={s.card} onSubmit={confirmCode}>
            {error && <p className={s.errorBanner} role="alert">{error}</p>}

            {/* The card itself carries no padding — every section supplies its own. */}
            <div className={s.otpBody}>
              <label className={s.otpLabel} htmlFor="profile-otp">{tr('Confirmation code')}</label>
              <input
                id="profile-otp"
                className={s.otpInput}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                aria-describedby="profile-otp-hint"
                autoFocus
              />
              <p className={s.helper} id="profile-otp-hint">{tr('The code expires after 10 minutes and can only be used once.')}</p>
              <p className={s.helper}>{tr('Wrong address? Contact your administrator to correct it.')}</p>
            </div>

            <div className={s.actions}>
              <button className={s.submit} type="submit" disabled={code.length !== 6 || busy}>
                {busy ? tr('Checking…') : tr('Confirm')}
              </button>
              <button
                className={s.secondary}
                type="button"
                onClick={resendCode}
                disabled={busy || resendIn > 0}
              >
                {resendIn > 0
                  ? tr('Resend the code ({seconds}s)', { seconds: resendIn })
                  : tr('Resend the code')}
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className={s.screen}>
      {chrome}

      <main className={s.main}>
        <div className={s.intro}>
          <div>
            <p className={s.eyebrow}>{initialComplete ? 'PROFILE' : 'CLIENT ONBOARDING'}</p>
            <h1>{initialComplete ? 'Your profile' : 'Complete your profile'}</h1>
            <p className={s.lede}>
              {initialComplete
                ? 'Keep your personal and mailing details up to date.'
                : 'Tell us a little about yourself before entering your dashboard.'}
            </p>
          </div>
          {!initialComplete && (
            <div className={s.progress} aria-label={tr('Onboarding progress: step 1 of 1')}>
              <span>{tr('Step 1 of 1')}</span>
              <span className={s.progressTrack}><span /></span>
            </div>
          )}
        </div>

        <form className={s.card} onSubmit={submit} noValidate>
          {error && <div className={s.errorBanner} role="alert">{error}</div>}

          <fieldset className={s.fieldset}>
            <legend>{tr('Personal information')}</legend>
            <p className={s.sectionHint}>{tr('All fields are required.')}</p>

            <div className={s.grid}>
              <div className={s.field}>
                <label htmlFor="preferredName">{tr('Preferred name')}</label>
                <input
                  id="preferredName"
                  name="preferredName"
                  value={form.preferredName}
                  maxLength={80}
                  autoComplete="nickname"
                  placeholder="Ravens"
                  aria-invalid={Boolean(preferredError)}
                  aria-describedby={'preferredName-helper' + (preferredError ? ' preferredName-error' : '')}
                  onChange={(event) => update('preferredName', event.target.value)}
                  onBlur={() => blur('preferredName')}
                />
                <FieldMessage
                  id="preferredName"
                  helper="The name we will use throughout your dashboard."
                  error={preferredError}
                />
              </div>

              <div className={s.field}>
                <label htmlFor="legalName">{tr('Legal name')}</label>
                <input
                  id="legalName"
                  name="legalName"
                  value={form.legalName}
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Ravens Send2"
                  aria-invalid={Boolean(legalError)}
                  aria-describedby={'legalName-helper' + (legalError ? ' legalName-error' : '')}
                  onChange={(event) => update('legalName', event.target.value)}
                  onBlur={() => blur('legalName')}
                />
                <FieldMessage
                  id="legalName"
                  helper="Enter your name exactly as it appears on official documents."
                  error={legalError}
                />
              </div>

              <div className={s.field}>
                <label htmlFor="dateOfBirth">{tr('Date of birth')}</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  max={today}
                  value={form.dateOfBirth}
                  autoComplete="bday"
                  aria-invalid={Boolean(birthError)}
                  aria-describedby={'dateOfBirth-helper' + (birthError ? ' dateOfBirth-error' : '')}
                  onChange={(event) => update('dateOfBirth', event.target.value)}
                  onBlur={() => blur('dateOfBirth')}
                />
                <FieldMessage
                  id="dateOfBirth"
                  helper="Use the date shown on your identity document."
                  error={birthError}
                />
              </div>

              <div className={s.field}>
                <label htmlFor="phoneNumber">{tr('Phone number')}</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  maxLength={32}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+33 6 12 34 56 78"
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={'phoneNumber-helper' + (phoneError ? ' phoneNumber-error' : '')}
                  onChange={(event) => update('phoneNumber', event.target.value)}
                  onBlur={() => blur('phoneNumber')}
                />
                <FieldMessage
                  id="phoneNumber"
                  helper="Include your country code so we can reach you internationally."
                  error={phoneError}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={s.fieldset}>
            <legend>{tr('Address information')}</legend>
            <div className={s.addressGrid}>
              <div className={s.field}>
                <label htmlFor="residentialAddress">{tr('Residential address')}</label>
                <textarea
                  id="residentialAddress"
                  name="residentialAddress"
                  rows={3}
                  value={form.residentialAddress}
                  maxLength={300}
                  autoComplete="street-address"
                  placeholder={'12 Rue de Rivoli\n75001 Paris\nFrance'}
                  aria-invalid={Boolean(residentialError)}
                  aria-describedby={
                    'residentialAddress-helper' +
                    (residentialError ? ' residentialAddress-error' : '')
                  }
                  onChange={(event) => update('residentialAddress', event.target.value)}
                  onBlur={() => blur('residentialAddress')}
                />
                <FieldMessage
                  id="residentialAddress"
                  helper="Your current primary place of residence."
                  error={residentialError}
                />
              </div>

              <label className={s.checkbox}>
                <input
                  type="checkbox"
                  checked={sameAsResidential}
                  onChange={(event) => setSameAsResidential(event.target.checked)}
                />
                <span>
                  <strong>{tr('Mailing address is the same')}</strong>
                  <small>{tr('Use your residential address for correspondence.')}</small>
                </span>
              </label>

              <div className={s.field}>
                <label htmlFor="mailingAddress">{tr('Mailing address')}</label>
                <textarea
                  id="mailingAddress"
                  name="mailingAddress"
                  rows={3}
                  value={sameAsResidential ? form.residentialAddress : form.mailingAddress}
                  maxLength={300}
                  autoComplete="shipping street-address"
                  placeholder={'25 Avenue de France\n75013 Paris\nFrance'}
                  disabled={sameAsResidential}
                  aria-invalid={Boolean(mailingError)}
                  aria-describedby={'mailingAddress-helper' + (mailingError ? ' mailingAddress-error' : '')}
                  onChange={(event) => update('mailingAddress', event.target.value)}
                  onBlur={() => blur('mailingAddress')}
                />
                <FieldMessage
                  id="mailingAddress"
                  helper={
                    sameAsResidential
                      ? 'We will use your residential address.'
                      : 'The address where you receive mail and correspondence.'
                  }
                  error={mailingError}
                />
              </div>
            </div>
          </fieldset>

          <div className={s.actions}>
            <p>{tr('Your details are saved to your profile.')}</p>
            <button className={s.submit} type="submit" disabled={busy || !canSubmit}>
              {busy ? 'Saving…' : initialComplete ? 'Save and return to dashboard' : 'Continue to dashboard'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
