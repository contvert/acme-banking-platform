'use client';

import { useState } from 'react';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { useConfig } from '@/components/config/ConfigProvider';
import { CURRENCIES, type Currency } from '@/lib/config/types';
import { Switch } from './Sections';
import type { useAdmin } from './useAdmin';
import p from '@/components/ds/Page.module.css';
import s from './Admin.module.css';
import { useT } from '@/components/i18n/I18nProvider';

type Admin = ReturnType<typeof useAdmin>;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={s.label}>{label}</label>
      {children}
    </div>
  );
}

const num = (v: string) => Number(v.replace(/[^\d.-]/g, '')) || 0;

/* --------------------------------------------------------------- accounts */

const ACCOUNT_KINDS = ['checking', 'savings', 'credit', 'treasury'] as const;
const ACCOUNT_STATUSES = ['active', 'restricted', 'closed'] as const;

export function AccountsPanel({ admin }: { admin: Admin }) {
  const translate = useT();
  const { money } = useConfig();
  const [draft, setDraft] = useState({ name: '', last4: '', balance: '0', kind: 'checking' });

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <div className={`${s.grid} ${s.grid4}`}>
          <Field label={translate('Account name')}>
            <input className={s.input} value={draft.name} placeholder={translate('Checking account')}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label={translate('Type')}>
            <select className={s.select} value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })}>
              {ACCOUNT_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </Field>
          <Field label={translate('Last 4 digits')}>
            <input className={s.input} value={draft.last4} placeholder="1038" maxLength={4}
              onChange={(e) => setDraft({ ...draft, last4: e.target.value.replace(/\D/g, '') })} />
          </Field>
          <Field label={translate('Opening balance')}>
            <input className={s.input} value={draft.balance} inputMode="decimal"
              onChange={(e) => setDraft({ ...draft, balance: e.target.value })} />
          </Field>
        </div>
        <div className={p.headActions} style={{ marginTop: 16 }}>
          <button
            className={`${p.btn} ${p.btnPrimary}`}
            type="button"
            disabled={admin.busy || !draft.name.trim()}
            onClick={async () => {
              const balance = num(draft.balance);
              const ok = await admin.create('accounts', {
                name: draft.name.trim(),
                kind: draft.kind as any,
                last4: draft.last4 || '0000',
                balance,
                available: balance,
                pending: 0,
                currency: admin.config.defaultCurrency,
                status: 'active',
              });
              if (ok) setDraft({ name: '', last4: '', balance: '0', kind: 'checking' });
            }}
          >
            <Icon name="plus" size={13} />{translate('Add account')}</button>
        </div>
      </Card>

      <Card>
        {admin.config.accounts.length === 0 && <div className={s.empty}>{translate('No accounts.')}</div>}
        {admin.config.accounts.map((a) => (
          <div key={a.id} className={s.row}>
            <div className={s.rowMain}>
              <input
                className={s.input}
                value={a.name}
                onChange={(e) => admin.update('accounts', a.id, { name: e.target.value })}
              />
              <div className={s.rowMeta} style={{ marginTop: 6 }}>
                ••{a.last4} · {money(a.balance, a.currency)} ·{' '}
                {translate('available {amount}', { amount: money(a.available, a.currency) })}
                {a.pending
                  ? ` · ${translate('pending {amount}', { amount: money(a.pending, a.currency) })}`
                  : ''}
              </div>
            </div>

            <Field label={translate('Balance')}>
              <input className={s.input} style={{ width: 130 }} defaultValue={a.balance} inputMode="decimal"
                onBlur={(e) => admin.update('accounts', a.id, { balance: num(e.target.value) })} />
            </Field>
            <Field label={translate('Available')}>
              <input className={s.input} style={{ width: 130 }} defaultValue={a.available} inputMode="decimal"
                onBlur={(e) => admin.update('accounts', a.id, { available: num(e.target.value) })} />
            </Field>
            <Field label={translate('Pending')}>
              <input className={s.input} style={{ width: 120 }} defaultValue={a.pending} inputMode="decimal"
                onBlur={(e) => admin.update('accounts', a.id, { pending: num(e.target.value) })} />
            </Field>
            <Field label={translate('Currency')}>
              <select className={s.select} style={{ width: 100 }} value={a.currency}
                onChange={(e) => admin.update('accounts', a.id, { currency: e.target.value as Currency })}>
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </Field>
            <Field label={translate('Type')}>
              <select className={s.select} style={{ width: 120 }} value={a.kind}
                onChange={(e) => admin.update('accounts', a.id, { kind: e.target.value })}>
                {ACCOUNT_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>
            <Field label={translate('Status')}>
              <select className={s.select} style={{ width: 130 }} value={a.status}
                onChange={(e) => admin.update('accounts', a.id, { status: e.target.value })}>
                {ACCOUNT_STATUSES.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>

            <button className={`${p.btn} ${s.danger}`} type="button"
              onClick={() => admin.remove('accounts', a.id)} aria-label={`Supprimer ${a.name}`}>
              <Icon name="trash-can" size={13} />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ cards */

const CARD_STATUSES = ['active', 'frozen', 'suspended', 'cancelled'] as const;

export function CardsPanel({ admin }: { admin: Admin }) {
  const translate = useT();
  const [draft, setDraft] = useState({ holder: '', label: '', last4: '' });
  const accounts = admin.config.accounts;

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <div className={`${s.grid} ${s.grid3}`}>
          <Field label={translate('Account holder')}>
            <input className={s.input} value={draft.holder} placeholder="Jane Black"
              onChange={(e) => setDraft({ ...draft, holder: e.target.value })} />
          </Field>
          <Field label={translate('Label')}>
            <input className={s.input} value={draft.label} placeholder="Carte équipe"
              onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          </Field>
          <Field label={translate('Last 4 digits')}>
            <input className={s.input} value={draft.last4} maxLength={4} placeholder="4242"
              onChange={(e) => setDraft({ ...draft, last4: e.target.value.replace(/\D/g, '') })} />
          </Field>
        </div>
        <div className={p.headActions} style={{ marginTop: 16 }}>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button"
            disabled={admin.busy || !draft.holder.trim() || accounts.length === 0}
            onClick={async () => {
              const ok = await admin.create('cards', {
                holder: draft.holder.trim(),
                label: draft.label.trim(),
                last4: draft.last4 || '0000',
                type: 'virtual',
                accountId: accounts[0].id,
                status: 'active',
                spentThisMonth: 0,
                enabled: true,
              });
              if (ok) setDraft({ holder: '', label: '', last4: '' });
            }}>
            <Icon name="plus" size={13} />{translate('Add card')}</button>
          {accounts.length === 0 && <span className={s.rowMeta}>{translate('Create an account first.')}</span>}
        </div>
      </Card>

      <Card>
        {admin.config.cards.length === 0 && <div className={s.empty}>{translate('No cards.')}</div>}
        {admin.config.cards.map((c) => (
          <div key={c.id} className={s.row}>
            <div className={s.rowMain}>
              <div className={s.rowTitle}>••{c.last4} {c.label}</div>
              <div className={s.rowMeta}>{c.holder}</div>
            </div>

            <Field label={translate('Account')}>
              <select className={s.select} style={{ width: 170 }} value={c.accountId}
                onChange={(e) => admin.update('cards', c.id, { accountId: e.target.value })}>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label={translate('Type')}>
              <select className={s.select} style={{ width: 120 }} value={c.type}
                onChange={(e) => admin.update('cards', c.id, { type: e.target.value })}>
                <option value="virtual">{translate('virtual')}</option>
                <option value="physical">{translate('physical')}</option>
              </select>
            </Field>
            <Field label={translate('Status')}>
              <select className={s.select} style={{ width: 130 }} value={c.status}
                onChange={(e) => admin.update('cards', c.id, { status: e.target.value })}>
                {CARD_STATUSES.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>
            <Field label={translate('Enabled')}>
              <Switch on={c.enabled} label={`Activer ${c.last4}`}
                onChange={(v) => admin.update('cards', c.id, { enabled: v })} />
            </Field>

            <button className={`${p.btn} ${s.danger}`} type="button"
              onClick={() => admin.remove('cards', c.id)} aria-label={`Supprimer ${c.last4}`}>
              <Icon name="trash-can" size={13} />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}

/* ----------------------------------------------------------- transactions */

export function TransactionsPanel({ admin }: { admin: Admin }) {
  const translate = useT();
  const { money } = useConfig();
  const accounts = admin.config.accounts;
  const [draft, setDraft] = useState({ party: '', amount: '', method: 'Virement' });

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <div className={`${s.grid} ${s.grid3}`}>
          <Field label={translate('Counterparty')}>
            <input className={s.input} value={draft.party} placeholder="Fournisseur SARL"
              onChange={(e) => setDraft({ ...draft, party: e.target.value })} />
          </Field>
          <Field label={translate('Amount (negative = outgoing)')}>
            <input className={s.input} value={draft.amount} inputMode="decimal" placeholder="-1250.00"
              onChange={(e) => setDraft({ ...draft, amount: e.target.value })} />
          </Field>
          <Field label={translate('Method')}>
            <input className={s.input} value={draft.method}
              onChange={(e) => setDraft({ ...draft, method: e.target.value })} />
          </Field>
        </div>
        <div className={p.headActions} style={{ marginTop: 16 }}>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button"
            disabled={admin.busy || !draft.party.trim() || accounts.length === 0}
            onClick={async () => {
              const ok = await admin.create('transactions', {
                date: new Date().toISOString().slice(0, 10),
                party: draft.party.trim(),
                amount: num(draft.amount),
                accountId: accounts[0].id,
                method: draft.method,
                status: 'completed',
              });
              if (ok) setDraft({ party: '', amount: '', method: 'Virement' });
            }}>
            <Icon name="plus" size={13} />{translate('Add transaction')}</button>
          {accounts.length === 0 && <span className={s.rowMeta}>{translate('Create an account first.')}</span>}
        </div>
      </Card>

      <Card>
        {admin.config.transactions.length === 0 && <div className={s.empty}>{translate('No transactions.')}</div>}
        {admin.config.transactions.map((t) => {
          const acc = accounts.find((a) => a.id === t.accountId);
          return (
            <div key={t.id} className={s.row}>
              <div className={s.rowMain}>
                <div className={s.rowTitle}>{t.party}</div>
                <div className={s.rowMeta}>
                  {t.date} · {money(t.amount, acc?.currency)} · {t.method}
                </div>
              </div>
              <Field label={translate('Date')}>
                <input className={s.input} type="date" style={{ width: 160 }} defaultValue={t.date}
                  onBlur={(e) => admin.update('transactions', t.id, { date: e.target.value })} />
              </Field>
              <Field label={translate('Amount')}>
                <input className={s.input} style={{ width: 130 }} defaultValue={t.amount} inputMode="decimal"
                  onBlur={(e) => admin.update('transactions', t.id, { amount: num(e.target.value) })} />
              </Field>
              <Field label={translate('Account')}>
                <select className={s.select} style={{ width: 170 }} value={t.accountId}
                  onChange={(e) => admin.update('transactions', t.id, { accountId: e.target.value })}>
                  {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </Field>
              <Field label={translate('Status')}>
                <select className={s.select} style={{ width: 140 }} value={t.status}
                  onChange={(e) => admin.update('transactions', t.id, { status: e.target.value })}>
                  <option value="completed">{translate('completed')}</option>
                  <option value="pending">{translate('pending')}</option>
                  <option value="failed">{translate('failed')}</option>
                </select>
              </Field>
              <button className={`${p.btn} ${s.danger}`} type="button"
                onClick={() => admin.remove('transactions', t.id)} aria-label={`Supprimer ${t.party}`}>
                <Icon name="trash-can" size={13} />
              </button>
            </div>
          );
        })}
      </Card>
    </>
  );
}

/* ---------------------------------------------------------- notifications */

const LEVELS = ['info', 'success', 'warning', 'error'] as const;

export function NotificationsPanel({ admin }: { admin: Admin }) {
  const translate = useT();
  const [draft, setDraft] = useState({ title: '', body: '', level: 'info' as (typeof LEVELS)[number] });

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <div className={`${s.grid} ${s.grid2}`}>
          <Field label={translate('Title')}>
            <input className={s.input} value={draft.title} placeholder="Virement reçu"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </Field>
          <Field label={translate('Level')}>
            <select className={s.select} value={draft.level}
              onChange={(e) => setDraft({ ...draft, level: e.target.value as (typeof LEVELS)[number] })}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ marginTop: 12 }}>
          <Field label={translate('Message')}>
            <textarea className={s.textarea} value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          </Field>
        </div>
        <div className={p.headActions} style={{ marginTop: 16 }}>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button"
            disabled={admin.busy || !draft.title.trim()}
            onClick={async () => {
              const ok = await admin.create('notifications', {
                title: draft.title.trim(),
                body: draft.body.trim(),
                level: draft.level,
                createdAt: new Date().toISOString(),
                read: false,
              });
              if (ok) setDraft({ title: '', body: '', level: 'info' });
            }}>
            <Icon name="plus" size={13} />{translate('Add')}</button>
        </div>
      </Card>

      <Card>
        {admin.config.notifications.length === 0 && <div className={s.empty}>{translate('No notifications.')}</div>}
        {admin.config.notifications.map((n) => (
          <div key={n.id} className={s.row}>
            <div className={s.rowMain}>
              <div className={s.rowTitle}>{n.title}</div>
              <div className={s.rowMeta}>
                {n.level} · {new Date(n.createdAt).toLocaleString('fr-FR')} · {n.read ? 'lue' : 'non lue'}
              </div>
              {n.body && <div style={{ fontSize: 15, marginTop: 4 }}>{n.body}</div>}
            </div>
            <Field label={translate('Read')}>
              <Switch on={n.read} label={`Marquer ${n.title}`}
                onChange={(v) => admin.update('notifications', n.id, { read: v })} />
            </Field>
            <button className={`${p.btn} ${s.danger}`} type="button"
              onClick={() => admin.remove('notifications', n.id)} aria-label={`Supprimer ${n.title}`}>
              <Icon name="trash-can" size={13} />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}
