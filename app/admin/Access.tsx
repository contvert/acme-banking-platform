'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { Switch } from './Sections';
import type { useAdmin } from './useAdmin';
import type { Role } from '@/lib/auth/types';
import p from '@/components/ds/Page.module.css';
import s from './Admin.module.css';
import { useI18n } from '@/components/i18n/I18nProvider';

type Admin = ReturnType<typeof useAdmin>;

interface ListedUser {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  accountIds: string[];
  profileComplete: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  disabled: boolean;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={s.label}>{label}</label>
      {children}
      {hint && <div className={s.rowMeta} style={{ marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

interface Figures { balance: string; available: string; pending: string }

/** Tolerates spaces and currency signs, so a pasted figure still lands. */
const num = (value: string) => Number(value.replace(/[^\d.-]/g, '')) || 0;

const figuresOf = (account: { balance: number; available: number; pending: number }): Figures => ({
  balance: String(account.balance),
  available: String(account.available),
  pending: String(account.pending),
});

/** Suggests a password the operator can hand over, rather than inventing a weak one. */
function suggestPassword() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '').slice(0, 14);
}

const EMPTY = { username: '', displayName: '', password: '', accountIds: [] as string[] };

export function AccessPanel({ admin }: { admin: Admin }) {
  const { t, tag } = useI18n();
  const [users, setUsers] = useState<ListedUser[]>([]);
  const [draft, setDraft] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [edit, setEdit] = useState({ username: '', displayName: '', accountIds: [] as string[] });
  // Balances are edited as text so a half-typed figure is not rounded away.
  const [balances, setBalances] = useState<Record<string, Figures>>({});

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/users', { cache: 'no-store' });
    if (res.ok) setUsers(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  async function call(url: string, init: RequestInit, ok: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        ...init,
        headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { setError(body.error ?? `${res.status}`); return false; }
      await load();
      setNotice(ok);
      window.setTimeout(() => setNotice(null), 2500);
      return true;
    } finally {
      setBusy(false);
    }
  }

  const accounts = admin.config.accounts;
  const toggleAccount = (id: string) =>
    setDraft((d) => ({
      ...d,
      accountIds: d.accountIds.includes(id)
        ? d.accountIds.filter((x) => x !== id)
        : [...d.accountIds, id],
    }));

  const canCreate = draft.username.trim().length >= 3 && draft.password.length >= 8;

  function startEdit(user: ListedUser) {
    setEditing(user.id);
    setError(null);
    setEdit({
      username: user.username,
      displayName: user.displayName,
      accountIds: [...user.accountIds],
    });
    setBalances(Object.fromEntries(accounts.map((a) => [a.id, figuresOf(a)])));
  }

  /** The accounts this client would see with the selection currently on screen. */
  const visibleAccounts = () =>
    edit.accountIds.length === 0 ? accounts : accounts.filter((a) => edit.accountIds.includes(a.id));

  /** How many other clients also see an account, so a shared figure says so. */
  const alsoSeenBy = (accountId: string, self: string) =>
    users.filter(
      (u) =>
        u.id !== self &&
        u.role === 'client' &&
        (u.accountIds.length === 0 || u.accountIds.includes(accountId)),
    ).length;

  /** Only the figures that actually moved are written back. */
  async function saveBalances() {
    for (const account of accounts) {
      const draftFigures = balances[account.id];
      if (!draftFigures) continue;
      const patch: Record<string, number> = {};
      if (num(draftFigures.balance) !== account.balance) patch.balance = num(draftFigures.balance);
      if (num(draftFigures.available) !== account.available) {
        patch.available = num(draftFigures.available);
      }
      if (num(draftFigures.pending) !== account.pending) patch.pending = num(draftFigures.pending);
      if (Object.keys(patch).length) await admin.update('accounts', account.id, patch);
    }
  }

  const balancesChanged = () =>
    accounts.some((a) => {
      const f = balances[a.id];
      return (
        f &&
        (num(f.balance) !== a.balance ||
          num(f.available) !== a.available ||
          num(f.pending) !== a.pending)
      );
    });

  const toggleEditAccount = (id: string) =>
    setEdit((e) => ({
      ...e,
      accountIds: e.accountIds.includes(id)
        ? e.accountIds.filter((x) => x !== id)
        : [...e.accountIds, id],
    }));

  /** Only what actually changed is sent, so a save is never a silent rewrite. */
  function editPatch(user: ListedUser) {
    const patch: Record<string, unknown> = {};
    const username = edit.username.trim().toLowerCase();
    const displayName = edit.displayName.trim();
    if (username && username !== user.username) patch.username = username;
    if (displayName !== user.displayName) patch.displayName = displayName;
    const before = [...user.accountIds].sort().join(',');
    const after = [...edit.accountIds].sort().join(',');
    if (before !== after) patch.accountIds = edit.accountIds;
    return patch;
  }

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 400, margin: '0 0 4px', color: 'var(--ds-text-emphasized)' }}>{t('Create client access')}</h2>
        <p className={s.rowMeta} style={{ marginTop: 0, marginBottom: 16 }}>
          {t(
            'The client signs in at {path}, completes their profile, then lands on their dashboard. They see only the accounts ticked here, and have no access to this administration.',
            { path: '/login' },
          )}
        </p>

        {error && <div className={s.err} style={{ marginBottom: 12 }}>{error}</div>}
        {notice && <div className={s.ok} style={{ marginBottom: 12 }}>{notice}</div>}

        <div className={`${s.grid} ${s.grid3}`}>
          <Field label={t('Email or username')} hint={t('Recommended email address')}>
            <input className={s.input} value={draft.username} placeholder="client@entreprise.com"
              onChange={(e) => setDraft({ ...draft, username: e.target.value.toLowerCase() })} />
          </Field>
          <Field label={t('Display name')}>
            <input className={s.input} value={draft.displayName} placeholder="Marie Dupont"
              onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} />
          </Field>
          <Field label={t('Password')} hint={t('At least 8 characters')}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className={s.input} value={draft.password}
                onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
              <button className={p.btn} type="button" title={t('Suggest a password')}
                onClick={() => setDraft((d) => ({ ...d, password: suggestPassword() }))}>
                <Icon name="sparkles" size={13} />
              </button>
            </div>
          </Field>
        </div>

        <div style={{ marginTop: 16 }}>
          <label className={s.label}>{t('Accounts visible to this client')}</label>
          {accounts.length === 0 ? (
            <p className={s.rowMeta}>{t('No accounts configured.')}</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {accounts.map((a) => {
                const on = draft.accountIds.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    className={p.btn}
                    aria-pressed={on}
                    style={on ? { borderColor: 'var(--ds-background-primary)', color: 'var(--ds-text-focused)' } : undefined}
                    onClick={() => toggleAccount(a.id)}
                  >
                    <Icon name={on ? 'circle-check' : 'plus'} size={13} /> {a.name}
                  </button>
                );
              })}
            </div>
          )}
          <div className={s.rowMeta} style={{ marginTop: 6 }}>{t('No account ticked: the client will see every account.')}</div>
        </div>

        <div className={p.headActions} style={{ marginTop: 20 }}>
          <button
            className={`${p.btn} ${p.btnPrimary}`}
            type="button"
            disabled={busy || !canCreate}
            onClick={async () => {
              const ok = await call('/api/admin/users', {
                method: 'POST',
                body: JSON.stringify({ ...draft, role: 'client' }),
              }, t('Access created — username {username}, password {password}', {
                username: draft.username,
                password: draft.password,
              }));
              if (ok) setDraft(EMPTY);
            }}
          >
            <Icon name="user-plus" size={13} />{t('Create access')}</button>
        </div>
      </Card>

      <Card>
        {users.length === 0 && <p className={s.empty}>{t('No access yet.')}</p>}
        {users.map((u) => (
          <div key={u.id} className={s.userBlock}>
          <div className={s.row}>
            <div className={s.rowMain}>
              <div className={s.rowTitle}>
                {u.displayName}
                <span className={s.tabCount} style={{ marginLeft: 8 }}>{u.role}</span>
                {u.disabled && <span className={s.tabCount} style={{ marginLeft: 6 }}>{t('disabled')}</span>}
                {u.role === 'client' && (
                  <span className={s.tabCount} style={{ marginLeft: 6 }}>
                    {u.profileComplete ? t('profile complete') : t('profile incomplete')}
                  </span>
                )}
              </div>
              <div className={s.rowMeta}>
                {u.username} · {t('created on {date}', {
                  date: new Date(u.createdAt).toLocaleDateString(tag),
                })} ·{' '}
                {u.lastLoginAt
                  ? t('last sign-in {when}', { when: new Date(u.lastLoginAt).toLocaleString(tag) })
                  : t('never signed in')}
              </div>
              <div className={s.rowMeta}>
                {u.role === 'admin'
                  ? t('Full access, administration included')
                  : u.accountIds.length
                    ? `${t('Accounts')} : ${u.accountIds
                        .map((id) => accounts.find((a) => a.id === id)?.name ?? id)
                        .join(', ')}`
                    : t('All accounts')}
              </div>
            </div>

            <button
              className={p.btn}
              type="button"
              onClick={() => (editing === u.id ? setEditing(null) : startEdit(u))}
            >
              <Icon name={editing === u.id ? 'check' : 'pen'} size={13} />
              {editing === u.id ? t('Done') : t('Edit')}
            </button>

            <Field label={t('Active')}>
              <Switch
                on={!u.disabled}
                label={`${t('Active')} — ${u.username}`}
                onChange={(v) => call(`/api/admin/users/${u.id}`, {
                  method: 'PATCH', body: JSON.stringify({ disabled: !v }),
                }, v ? t('Access re-enabled') : t('Access disabled'))}
              />
            </Field>

            {resetting === u.id ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <Field label={t('New password')}>
                  <input className={s.input} style={{ width: 180 }} value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                </Field>
                <button className={p.btn} type="button" onClick={() => { setResetting(null); setNewPassword(''); }}>{t('Cancel')}</button>
                <button
                  className={`${p.btn} ${p.btnPrimary}`}
                  type="button"
                  disabled={busy || newPassword.length < 8}
                  onClick={async () => {
                    const ok = await call(`/api/admin/users/${u.id}`, {
                      method: 'PATCH', body: JSON.stringify({ password: newPassword }),
                    }, t('Password changed — {password}', { password: newPassword }));
                    if (ok) { setResetting(null); setNewPassword(''); }
                  }}
                >{t('Save')}</button>
              </div>
            ) : (
              <button className={p.btn} type="button"
                onClick={() => { setResetting(u.id); setNewPassword(suggestPassword()); }}>
                <Icon name="key" size={13} />{t('Password')}</button>
            )}

            <button
              className={`${p.btn} ${s.danger}`}
              type="button"
              disabled={busy}
              onClick={() => call(`/api/admin/users/${u.id}`, { method: 'DELETE' }, t('Access deleted'))}
              aria-label={`${t('Delete')} — ${u.username}`}
            >
              <Icon name="trash-can" size={13} />
            </button>
          </div>

          {editing === u.id && (
            <div className={s.editPanel}>
              <div className={`${s.grid} ${s.grid2}`}>
                <Field
                  label={t('Sign-in address')}
                  hint={
                    edit.username.trim().toLowerCase() !== u.username
                      ? t('Changing the address cancels its confirmation: the client confirms the new one before adding a beneficiary again.')
                      : undefined
                  }
                >
                  <input
                    className={s.input}
                    value={edit.username}
                    onChange={(e) => setEdit({ ...edit, username: e.target.value.toLowerCase() })}
                  />
                </Field>
                <Field label={t('Display name')}>
                  <input
                    className={s.input}
                    value={edit.displayName}
                    onChange={(e) => setEdit({ ...edit, displayName: e.target.value })}
                  />
                </Field>
              </div>

              <div style={{ marginTop: 16 }}>
                <label className={s.label}>{t('Accounts visible to this client')}</label>
                {accounts.length === 0 ? (
                  <p className={s.rowMeta}>{t('No accounts configured.')}</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {accounts.map((a) => {
                      const on = edit.accountIds.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          className={p.btn}
                          aria-pressed={on}
                          style={on ? { borderColor: 'var(--ds-background-primary)', color: 'var(--ds-text-focused)' } : undefined}
                          onClick={() => toggleEditAccount(a.id)}
                        >
                          <Icon name={on ? 'circle-check' : 'plus'} size={13} /> {a.name}
                        </button>
                      );
                    })}
                  </div>
                )}
                {edit.accountIds.length === 0 && (
                  <p className={s.rowMeta} style={{ marginTop: 6 }}>
                    {t('Every account, because none is ticked')}
                  </p>
                )}
              </div>

              {visibleAccounts().length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <label className={s.label}>{t('Balances')}</label>
                  {visibleAccounts().map((a) => {
                    const others = alsoSeenBy(a.id, u.id);
                    const f = balances[a.id] ?? figuresOf(a);
                    const set = (patch: Partial<Figures>) =>
                      setBalances((b) => ({ ...b, [a.id]: { ...f, ...patch } }));
                    return (
                      <div key={a.id} className={s.balanceRow}>
                        <div className={s.rowMain}>
                          <div className={s.rowTitle}>{a.name}</div>
                          <div className={s.rowMeta}>
                            {a.currency} ·{' '}
                            {others === 0
                              ? t('Only this client sees this account.')
                              : others === 1
                                ? t('Shared with {count} other client — changing a figure changes what they see too.', { count: others })
                                : t('Shared with {count} other clients — changing a figure changes what they see too.', { count: others })}
                          </div>
                        </div>
                        <Field label={t('Balance')}>
                          <input className={s.input} style={{ width: 130 }} inputMode="decimal"
                            value={f.balance} onChange={(e) => set({ balance: e.target.value })} />
                        </Field>
                        <Field label={t('Available')}>
                          <input className={s.input} style={{ width: 130 }} inputMode="decimal"
                            value={f.available} onChange={(e) => set({ available: e.target.value })} />
                        </Field>
                        <Field label={t('Pending')}>
                          <input className={s.input} style={{ width: 120 }} inputMode="decimal"
                            value={f.pending} onChange={(e) => set({ pending: e.target.value })} />
                        </Field>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className={p.btn} type="button" onClick={() => setEditing(null)}>
                  {t('Cancel')}
                </button>
                <button
                  className={`${p.btn} ${p.btnPrimary}`}
                  type="button"
                  disabled={busy || edit.username.trim().length < 3}
                  onClick={async () => {
                    const patch = editPatch(u);
                    const money = balancesChanged();
                    if (Object.keys(patch).length === 0 && !money) {
                      setNotice(t('No change to save'));
                      window.setTimeout(() => setNotice(null), 2500);
                      return;
                    }
                    if (money) await saveBalances();
                    const ok = Object.keys(patch).length
                      ? await call(`/api/admin/users/${u.id}`, {
                          method: 'PATCH', body: JSON.stringify(patch),
                        }, t('Access updated'))
                      : true;
                    if (money && !Object.keys(patch).length) {
                      setNotice(t('Access updated'));
                      window.setTimeout(() => setNotice(null), 2500);
                    }
                    if (ok) setEditing(null);
                  }}
                >
                  {t('Save')}
                </button>
              </div>
            </div>
          )}
          </div>
        ))}
      </Card>
    </>
  );
}
