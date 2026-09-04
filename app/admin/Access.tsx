'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { Switch } from './Sections';
import type { useAdmin } from './useAdmin';
import type { Role } from '@/lib/auth/types';
import p from '@/components/ds/Page.module.css';
import s from './Admin.module.css';

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

/** Suggests a password the operator can hand over, rather than inventing a weak one. */
function suggestPassword() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '').slice(0, 14);
}

const EMPTY = { username: '', displayName: '', password: '', accountIds: [] as string[] };

export function AccessPanel({ admin }: { admin: Admin }) {
  const [users, setUsers] = useState<ListedUser[]>([]);
  const [draft, setDraft] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

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

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 400, margin: '0 0 4px', color: 'var(--ds-text-emphasized)' }}>
          Créer un accès client
        </h2>
        <p className={s.rowMeta} style={{ marginTop: 0, marginBottom: 16 }}>
          Le client se connecte sur <strong>/login</strong>, complète son profil, puis arrive sur son tableau de bord.
          Il ne voit que les comptes cochés ici, et n’a aucun accès à cette administration.
        </p>

        {error && <div className={s.err} style={{ marginBottom: 12 }}>{error}</div>}
        {notice && <div className={s.ok} style={{ marginBottom: 12 }}>{notice}</div>}

        <div className={`${s.grid} ${s.grid3}`}>
          <Field label="Email ou identifiant" hint="Adresse e-mail recommandée">
            <input className={s.input} value={draft.username} placeholder="client@entreprise.com"
              onChange={(e) => setDraft({ ...draft, username: e.target.value.toLowerCase() })} />
          </Field>
          <Field label="Nom affiché">
            <input className={s.input} value={draft.displayName} placeholder="Marie Dupont"
              onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} />
          </Field>
          <Field label="Mot de passe" hint="8 caractères minimum">
            <div style={{ display: 'flex', gap: 8 }}>
              <input className={s.input} value={draft.password}
                onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
              <button className={p.btn} type="button" title="Proposer un mot de passe"
                onClick={() => setDraft((d) => ({ ...d, password: suggestPassword() }))}>
                <Icon name="sparkles" size={13} />
              </button>
            </div>
          </Field>
        </div>

        <div style={{ marginTop: 16 }}>
          <label className={s.label}>Comptes visibles par ce client</label>
          {accounts.length === 0 ? (
            <p className={s.rowMeta}>Aucun compte configuré.</p>
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
          <div className={s.rowMeta} style={{ marginTop: 6 }}>
            Aucun compte coché : le client verra tous les comptes.
          </div>
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
              }, `Accès créé — identifiant « ${draft.username} », mot de passe « ${draft.password} »`);
              if (ok) setDraft(EMPTY);
            }}
          >
            <Icon name="user-plus" size={13} /> Créer l’accès
          </button>
        </div>
      </Card>

      <Card>
        {users.length === 0 && <p className={s.empty}>Aucun accès.</p>}
        {users.map((u) => (
          <div key={u.id} className={s.row}>
            <div className={s.rowMain}>
              <div className={s.rowTitle}>
                {u.displayName}
                <span className={s.tabCount} style={{ marginLeft: 8 }}>{u.role}</span>
                {u.disabled && <span className={s.tabCount} style={{ marginLeft: 6 }}>désactivé</span>}
                {u.role === 'client' && (
                  <span className={s.tabCount} style={{ marginLeft: 6 }}>
                    {u.profileComplete ? 'profil complet' : 'profil à compléter'}
                  </span>
                )}
              </div>
              <div className={s.rowMeta}>
                {u.username} · créé le {new Date(u.createdAt).toLocaleDateString('fr-FR')} ·{' '}
                {u.lastLoginAt
                  ? `dernière connexion ${new Date(u.lastLoginAt).toLocaleString('fr-FR')}`
                  : 'jamais connecté'}
              </div>
              <div className={s.rowMeta}>
                {u.role === 'admin'
                  ? 'Accès complet, administration comprise'
                  : u.accountIds.length
                    ? `Comptes : ${u.accountIds.map((id) => accounts.find((a) => a.id === id)?.name ?? id).join(', ')}`
                    : 'Tous les comptes'}
              </div>
            </div>

            <Field label="Actif">
              <Switch
                on={!u.disabled}
                label={`Activer ${u.username}`}
                onChange={(v) => call(`/api/admin/users/${u.id}`, {
                  method: 'PATCH', body: JSON.stringify({ disabled: !v }),
                }, v ? 'Accès réactivé' : 'Accès désactivé')}
              />
            </Field>

            {resetting === u.id ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <Field label="Nouveau mot de passe">
                  <input className={s.input} style={{ width: 180 }} value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                </Field>
                <button className={p.btn} type="button" onClick={() => { setResetting(null); setNewPassword(''); }}>
                  Annuler
                </button>
                <button
                  className={`${p.btn} ${p.btnPrimary}`}
                  type="button"
                  disabled={busy || newPassword.length < 8}
                  onClick={async () => {
                    const ok = await call(`/api/admin/users/${u.id}`, {
                      method: 'PATCH', body: JSON.stringify({ password: newPassword }),
                    }, `Mot de passe changé — « ${newPassword} »`);
                    if (ok) { setResetting(null); setNewPassword(''); }
                  }}
                >
                  Enregistrer
                </button>
              </div>
            ) : (
              <button className={p.btn} type="button"
                onClick={() => { setResetting(u.id); setNewPassword(suggestPassword()); }}>
                <Icon name="key" size={13} /> Mot de passe
              </button>
            )}

            <button
              className={`${p.btn} ${s.danger}`}
              type="button"
              disabled={busy}
              onClick={() => call(`/api/admin/users/${u.id}`, { method: 'DELETE' }, 'Accès supprimé')}
              aria-label={`Supprimer ${u.username}`}
            >
              <Icon name="trash-can" size={13} />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}
