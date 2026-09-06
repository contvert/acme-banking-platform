'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ds/Icon';
import { useT } from '@/components/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import s from './Login.module.css';

function LoginForm() {
  const t = useT();
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // On a fresh install, quietly prefill the documented seed credentials.
  // That keeps the login screen faithful to the reference while still giving
  // the user a working way into the application.
  useEffect(() => {
    fetch('/api/auth/first-run')
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => {
        if (b?.firstRun) {
          setUsername(b.username);
          setPassword(b.password);
        }
      })
      .catch(() => {});
  }, []);

  function showUnavailable(feature: 'password reset' | 'passkeys' | 'privacy policy') {
    setError(
      feature === 'passkeys'
        ? t('Passkey sign-in is not available in this environment. Use your email and password.')
        : feature === 'privacy policy'
          ? t('This demonstration has no privacy policy of its own.')
          : t('Contact your administrator to reset your password.'),
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? t('Unable to log in.'));
        return;
      }
      // A full replace ensures the server layout is rebuilt with the new
      // session before the dashboard paints the user's scoped identity/data.
      const destination = body.user?.role === 'client' && !body.user?.profileComplete
        ? '/profile'
        : body.user?.role === 'admin' && next === '/dashboard'
          ? '/admin'
          : next;
      window.location.replace(destination);
    } catch {
      setError(t('Unable to log in.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={s.card} onSubmit={submit} autoComplete="off">
      <div className={s.cardBody}>
        <h1 className={s.title}>{t('Log in')}</h1>

        {error && <div className={s.error} role="alert">{error}</div>}

        <div className={s.field}>
          <label className={s.label} htmlFor="username">{t('Email')}</label>
          <div className={s.inputControl}>
            <input
              id="username"
              className={s.input}
              // The browser should not drop a saved identity into an empty
              // form on its own; a person signing in types who they are.
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="password">{t('Password')}</label>
          <div className={s.passwordControl}>
            <div className={s.passwordInput}>
              <input
                id="password"
                className={s.input}
                type={reveal ? 'text' : 'password'}
                // `new-password` is what actually stops Chrome pre-filling a
                // stored password: it ignores `off` on a field it reads as a
                // sign-in one.
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className={s.eye}
              type="button"
              aria-label={reveal ? t('Hide password') : t('Show password')}
              aria-pressed={reveal}
              onClick={() => setReveal((v) => !v)}
            >
              <Icon name={reveal ? 'eye-slash' : 'eye'} size={16} />
            </button>
          </div>
          <button
            className={s.forgot}
            type="button"
            onClick={() => showUnavailable('password reset')}
          >
            {t('Forgot password?')}
          </button>
        </div>

        <button className={s.submit} type="submit" disabled={busy || !username || !password}>
          {busy ? t('Logging in…') : t('Log in')}
        </button>
      </div>

      <div className={s.footer}>
        <button
          className={s.passkey}
          type="button"
          onClick={() => showUnavailable('passkeys')}
        >
          <Icon name="key" size={15} />
          {t('Continue with passkey')}
        </button>

        <p className={s.passkeyCopy}>
          {t('Log in securely using one click, your face, or your fingerprint.')}
          <br />
          <button type="button" className={s.inlineLink} onClick={() => showUnavailable('passkeys')}>
            {t('Learn how to set it up')}
            <Icon name="arrow-up-right" size={11} />
          </button>
        </p>

        <button
          className={s.privacy}
          type="button"
          onClick={() => showUnavailable('privacy policy')}
        >
          {t('Privacy Policy')}
        </button>
      </div>
    </form>
  );
}

/** Split out so the topbar can use the translator without the page being a hook. */
function OpenAccountLink() {
  const t = useT();
  return (
    <Link className={s.openAccount} href="/signup">
      {t('Open account')}
      <Icon name="chevron-right" size={15} />
    </Link>
  );
}

export default function LoginPage() {
  return (
    <div className={s.screen}>
      <div className={s.topbar}>
        <img src="/logo.png" alt="Mercury" className={s.topbarLogo} />
        <div className={s.topbarRight}>
          <LanguageSwitcher variant="standalone" />
          <OpenAccountLink />
        </div>
      </div>
      <div className={s.center}>
        <div className={s.stage}>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
