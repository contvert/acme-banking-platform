'use client';

import Link from 'next/link';
import { Card, CardHeader, CardFooterLink } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { useConfig } from '@/components/config/ConfigProvider';
import { useI18n } from '@/components/i18n/I18nProvider';
import s from './Dashboard.module.css';
import x from './TransactionsTable.module.css';

const initials = (name: string) =>
  name.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
    .slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** Headline figure: the sum of every non-credit account, in the default currency. */
export function LiveBalanceCard() {
  const { config, money } = useConfig();
  const { t } = useI18n();
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
        {t('{name} balance', { name: config.company.name })}
        <Icon name="shield-check" size={13} />
      </div>
      <div className={`${s.balanceValue} amount`}>{money(total)}</div>

      <div className={s.balanceMeta}>
        <span className={`${x.muted} amount`}>{t('Available {amount}', { amount: money(available) })}</span>
        {pending !== 0 && (
          <span className={`${x.muted} amount`}>· {t('Pending {amount}', { amount: money(pending) })}</span>
        )}
      </div>

      {mixed && (
        <p className={s.subtle}>
          {t('The total counts only accounts in {currency}; other currencies are listed separately.', {
            currency: config.defaultCurrency,
          })}
        </p>
      )}
    </Card>
  );
}

export function LiveAccountsCard() {
  const { config, money, isAdmin } = useConfig();
  const { t } = useI18n();
  const shown = config.accounts.slice(0, 6);

  return (
    <Card>
      <CardHeader
        title={t('Accounts')}
        actions={isAdmin ? [{ icon: 'plus', label: t('Manage accounts') }] : undefined}
      />
      {shown.length === 0 && (
        <p className={x.empty}>
          {isAdmin ? (
            <>{t('No accounts.')} <Link href="/admin" className={s.link}>{t('Add one')}</Link>.</>
          ) : t('No account is assigned to you.')}
        </p>
      )}
      {shown.map((a) => (
        <div key={a.id} className={s.row}>
          <span className={s.avatar}>{initials(a.name)}</span>
          <span className={s.rowLabel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {a.name}
            <span className={x.status} style={{ fontSize: 10, textTransform: 'uppercase', padding: '2px 6px', background: 'rgba(119, 197, 153, 0.15)', color: '#77c599' }}>
              {t(a.kind)}
            </span>
            {a.status !== 'active' && (
              <span className={`${x.status} ${x.statusPending}`}>{t(a.status)}</span>
            )}
          </span>
          <span className={`${s.rowValue} amount`}>{money(a.balance, a.currency)}</span>
        </div>
      ))}
      {config.accounts.length > shown.length && (
        <CardFooterLink href="/accounts">{t('View all accounts')}</CardFooterLink>
      )}
    </Card>
  );
}

export function LiveTransactions() {
  const { config, money, isAdmin } = useConfig();
  const { t } = useI18n();
  const rows = [...config.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);

  if (rows.length === 0) {
    return (
      <div className={x.wrap}>
        <p className={x.empty}>
          {isAdmin ? (
            <>{t('No transactions yet.')}{' '}
              <Link href="/admin" className={s.link}>{t('Add one')}</Link>.</>
          ) : t('No transactions yet.')}
        </p>
      </div>
    );
  }

  return (
    <div className={x.wrap}>
      <div className={x.scroll}>
        <table className={x.table}>
          <thead>
            <tr>
              <th>{t('Date')}</th>
              <th>{t('Counterparty')}</th>
              <th className={x.numeric}>{t('Amount')}</th>
              <th>{t('Account')}</th>
              <th>{t('Method')}</th>
              <th>{t('Status')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const acc = config.accounts.find((a) => a.id === r.accountId);
              return (
                <tr key={r.id}>
                  <td className={x.date}>{r.date}</td>
                  <td>
                    <span className={x.party}>
                      <span className={x.avatar}>{initials(r.party)}</span>
                      <span className={x.partyName}>{r.party}</span>
                    </span>
                  </td>
                  <td className={`${x.numeric} amount`} style={{ color: r.amount > 0 ? 'var(--ds-text-money-in)' : undefined }}>
                    {money(r.amount, acc?.currency)}
                  </td>
                  <td className={x.muted}>{acc?.name ?? '—'}</td>
                  <td className={x.muted}>{r.method}</td>
                  <td>
                    {r.status === 'completed'
                      ? <span className={`${x.status} ${x.statusOk}`}>{t('completed')}</span>
                      : r.status === 'pending'
                        ? <span className={`${x.status} ${x.statusPending}`}>{t('pending')}</span>
                        : <span className={`${x.status} ${x.statusFailed}`}>{t('failed')}</span>}
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
  const { t } = useI18n();
  const items = config.notifications;
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader title={t('Notifications')} />
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
  const { t, tag } = useI18n();
  const items = config.chat;
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader title={t('Messages')} />
      {items.slice(-6).map((m) => (
        <div key={m.id} style={{ padding: '10px 0', borderTop: '1px solid var(--ds-border-default)' }}>
          <div className={s.subtle} style={{ marginBottom: 2 }}>
            {m.author} · {new Date(m.at).toLocaleString(tag)}
          </div>
          <div style={{ fontSize: 15 }}>{m.body}</div>
        </div>
      ))}
    </Card>
  );
}
