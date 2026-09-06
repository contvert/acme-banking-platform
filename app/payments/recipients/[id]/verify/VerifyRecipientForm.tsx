'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ds/Icon';
import p from '@/components/ds/Page.module.css';
import s from './VerifyRecipientForm.module.css';
import { useT } from '@/components/i18n/I18nProvider';

export function VerifyRecipientForm({ recipientId }: { recipientId: string }) {
  const tr = useT();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('A verification code was sent to the email address on your client account.');
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.length !== 6) {
      setError('Enter the six-digit code from your email.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/recipients/${encodeURIComponent(recipientId)}/verify`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? 'Unable to verify this RIB.');
        if (response.status === 410 || response.status === 429) setCooldown(0);
        return;
      }

      window.location.replace(`/send-money/transfer?recipient=${encodeURIComponent(recipientId)}`);
    } catch {
      setError('Unable to verify this RIB. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setResending(true);
    setError(null);
    try {
      const response = await fetch(`/api/recipients/${encodeURIComponent(recipientId)}/resend`, {
        method: 'POST',
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? 'Unable to send a new code.');
        if (typeof body.retryAfterSeconds === 'number') setCooldown(body.retryAfterSeconds);
        return;
      }
      setCode('');
      setCooldown(60);
      setStatus('A new verification code has been sent. It expires in 10 minutes.');
    } catch {
      setError('Unable to send a new code. Check your connection and try again.');
    } finally {
      setResending(false);
    }
  }

  return (
    <form className={s.form} onSubmit={verify} noValidate>
      <div className={s.icon}><Icon name="envelope-open-dollar" size={22} /></div>
      <h2>{tr('Enter your verification code')}</h2>
      <p className={s.copy}>
        {tr('To protect this beneficiary, enter the six-digit code sent to the email address on your client account.')}
        <br /><br />
        <strong>{tr('Please check your spam folder if you do not see it in your inbox.')}</strong>
      </p>

      {error && <div className={s.error} role="alert">{error}</div>}
      <p className={s.status} role="status" aria-live="polite">{status}</p>

      <label className={s.label} htmlFor="otp-code">{tr('Six-digit code')}</label>
      <input
        id="otp-code"
        className={s.code}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        value={code}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, '').slice(0, 6));
          setError(null);
        }}
        aria-describedby="otp-code-hint"
        aria-invalid={Boolean(error)}
        placeholder="000000"
        required
        autoFocus
      />
      <p id="otp-code-hint" className={s.hint}>{tr('The code expires after 10 minutes and can be used once.')}</p>

      <button className={`${p.btn} ${p.btnPrimary} ${s.confirm}`} type="submit" disabled={code.length !== 6 || busy}>
        {busy ? 'Verifying…' : 'Verify RIB'}
      </button>

      <div className={s.footer}>
        <Link className={p.btn} href="/payments/recipients">{tr('Cancel')}</Link>
        <button className={p.btn} type="button" onClick={resend} disabled={resending || cooldown > 0}>
          {resending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </div>
    </form>
  );
}
