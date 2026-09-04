'use client';

import Link from 'next/link';
import { Card, CardHeader, CardFooterLink } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { useConfig } from '@/components/config/ConfigProvider';
import s from './Dashboard.module.css';
import t from './TransactionsTable.module.css';

const initials = (name: string) =>
  name.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
    .slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** Headline figure: the sum of every non-credit account, in the default currency. */
export function LiveBalanceCard() {
  const { config, money } = useConfig();
  const accounts = config.accounts.filter((a) => a.kind !== 'credit');
  const total = accounts
    .filter((a) => a.currency === config.defaultCurrency)
    .reduce((sum, a) => sum + a.balance, 0);
  const pending = accounts.reduce((sum, a) => sum + a.pending, 0);
  const available = accounts
    .filter((a) => a.currency === config.defaultCurrency)
    .reduce((sum, a) => sum + a.available, 0);

  const mixed = new Set(config.accounts.map((a) => a.currency)).size > 1;

  return (
    <Card>
      <div className={s.balanceLabel}>
        Solde {config.company.name}
        <Icon name="shield-check" size={13} />
      </div>
      <div className={s.balanceValue}>{money(total)}</div>

      <div className={s.balanceMeta}>
        <span className={t.muted}>Disponible {money(available)}</span>
        {pending !== 0 && <span className={t.muted}>· En attente {money(pending)}</span>}
      </div>

      {mixed && (
        <p className={s.subtle}>
          Le total ne compte que les comptes en {config.defaultCurrency}; les autres devises sont
          listées séparément.
        </p>
      )}
    </Card>
  );
}

export function LiveAccountsCard() {
  const { config, money, isAdmin } = useConfig();
  const shown = config.accounts.slice(0, 6);

  return (
    <Card>
      <CardHeader
        title="Comptes"
        actions={isAdmin ? [{ icon: 'plus', label: 'Gérer les comptes' }] : undefined}
      />
      {shown.length === 0 && (
        <p className={t.empty}>
          {isAdmin ? (
            <>Aucun compte. <Link href="/admin" className={s.link}>Ajoutez-en un</Link>.</>
          ) : 'Aucun compte ne vous est attribué.'}
        </p>
      )}
      {shown.map((a) => (
        <div key={a.id} className={s.row}>
          <span className={s.avatar}>{initials(a.name)}</span>
          <span className={s.rowLabel}>
            {a.name}
            {a.status !== 'active' && (
              <span className={`${t.status} ${t.statusPending}`}>{a.status}</span>
            )}
          </span>
          <span className={s.rowValue}>{money(a.balance, a.currency)}</span>
        </div>
      ))}
      {config.accounts.length > shown.length && (
        <CardFooterLink href="/accounts">Voir tous les comptes</CardFooterLink>
      )}
    </Card>
  );
}

export function LiveTransactions() {
  const { config, money, isAdmin } = useConfig();
  const rows = [...config.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);

  if (rows.length === 0) {
    return (
      <div className={t.wrap}>
        <p className={t.empty}>
          {isAdmin ? (
            <>Aucune transaction pour le moment.{' '}
              <Link href="/admin" className={s.link}>En ajouter</Link>.</>
          ) : 'Aucune transaction pour le moment.'}
        </p>
      </div>
    );
  }

  return (
    <div className={t.wrap}>
      <div className={t.scroll}>
        <table className={t.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Contrepartie</th>
              <th className={t.numeric}>Montant</th>
              <th>Compte</th>
              <th>Méthode</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const acc = config.accounts.find((a) => a.id === r.accountId);
              return (
                <tr key={r.id}>
                  <td className={t.date}>{r.date}</td>
                  <td>
                    <span className={t.party}>
                      <span className={t.avatar}>{initials(r.party)}</span>
                      <span className={t.partyName}>{r.party}</span>
                    </span>
                  </td>
                  <td className={t.numeric} style={{ color: r.amount > 0 ? 'var(--ds-text-money-in)' : undefined }}>
                    {money(r.amount, acc?.currency)}
                  </td>
                  <td className={t.muted}>{acc?.name ?? '—'}</td>
                  <td className={t.muted}>{r.method}</td>
                  <td>
                    {r.status === 'completed'
                      ? <span className={`${t.status} ${t.statusOk}`}>terminé</span>
                      : r.status === 'pending'
                        ? <span className={`${t.status} ${t.statusPending}`}>en attente</span>
                        : <span className={`${t.status} ${t.statusFailed}`}>échoué</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function LiveNotifications() {
  const { config } = useConfig();
  const items = config.notifications;
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader title="Notifications" />
      {items.map((n) => (
        <div key={n.id} className={s.row}>
          <span className={s.avatar}>
            <Icon
              name={n.level === 'error' ? 'circle-exclamation'
                : n.level === 'warning' ? 'triangle-exclamation'
                : n.level === 'success' ? 'circle-check' : 'circle-info'}
              size={13}
            />
          </span>
          <span className={s.rowLabel}>
            <span style={{ display: 'block', color: n.read ? 'var(--ds-text-secondary)' : undefined }}>
              {n.title}
            </span>
            {n.body && <span className={s.subtle}>{n.body}</span>}
          </span>
        </div>
      ))}
    </Card>
  );
}

export function LiveChat() {
  const { config } = useConfig();
  const items = config.chat;
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader title="Messages" />
      {items.slice(-6).map((m) => (
        <div key={m.id} style={{ padding: '10px 0', borderTop: '1px solid var(--ds-border-default)' }}>
          <div className={s.subtle} style={{ marginBottom: 2 }}>
            {m.author} · {new Date(m.at).toLocaleString('fr-FR')}
          </div>
          <div style={{ fontSize: 15 }}>{m.body}</div>
        </div>
      ))}
    </Card>
  );
}
