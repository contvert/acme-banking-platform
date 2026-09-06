'use client';

import { useState } from 'react';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { useConfig } from '@/components/config/ConfigProvider';
import { CURRENCIES, type Currency } from '@/lib/config/types';
import type { useAdmin } from './useAdmin';
import p from '@/components/ds/Page.module.css';
import s from './Admin.module.css';
import { useT } from '@/components/i18n/I18nProvider';
import type { Message } from '@/lib/i18n/messages/catalog';

type Admin = ReturnType<typeof useAdmin>;

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={[s.switch, on && s.switchOn].filter(Boolean).join(' ')}
      onClick={() => onChange(!on)}
    >
      <span className={s.knob} />
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={s.label}>{label}</label>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- company */

export function CompanyPanel({ admin }: { admin: Admin }) {
  const tr = useT();
  const [form, setForm] = useState(admin.config.company);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Card>
      <div className={`${s.grid} ${s.grid2}`}>
        <Field label={tr('Trade name')}>
          <input className={s.input} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label={tr('Legal name')}>
          <input className={s.input} value={form.legalName} onChange={(e) => set('legalName', e.target.value)} />
        </Field>
        <Field label={tr('Tagline')}>
          <input className={s.input} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </Field>
        <Field label={tr('Plan')}>
          <input className={s.input} value={form.plan} onChange={(e) => set('plan', e.target.value)} />
        </Field>
        <Field label={tr('Contact email')}>
          <input className={s.input} value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label={tr('Phone')}>
          <input className={s.input} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
      </div>

      <div style={{ marginTop: 20 }}>
        <Field label={tr('Address (one line per break)')}>
          <textarea
            className={s.textarea}
            value={form.address.join('\n')}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value.split('\n') }))}
          />
        </Field>
      </div>

      <div className={p.headActions} style={{ marginTop: 20 }}>
        <button
          className={`${p.btn} ${p.btnPrimary}`}
          type="button"
          disabled={admin.busy}
          onClick={() => admin.patchConfig({ company: form })}
        >{tr('Save')}</button>
      </div>
    </Card>
  );
}

/* --------------------------------------------------------------- currency */

export function CurrencyPanel({ admin }: { admin: Admin }) {
  const tr = useT();
  const { money } = useConfig();
  return (
    <Card>
      <Field label={tr('Default currency')}>
        <select
          className={s.select}
          value={admin.config.defaultCurrency}
          onChange={(e) => admin.patchConfig({ defaultCurrency: e.target.value as Currency })}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
          ))}
        </select>
      </Field>
      <p className={s.rowMeta} style={{ marginTop: 12 }}>
        Aperçu : {money(1234.5)} · chaque compte peut porter sa propre devise.
      </p>
    </Card>
  );
}

/* --------------------------------------------------------------- sections */

/** Catalogued keys; the panel translates them where it renders them. */
const SECTION_LABELS: Record<string, Message> = {
  balanceChart: 'Balance chart',
  accounts: 'Account list',
  creditCard: 'Credit Card',
  billPay: 'Bill payment',
  invoicing: 'Invoicing',
  moneyMovement: 'Money in / out',
  transactions: 'Transactions',
  notifications: 'Notifications',
  chat: 'Internal chat',
};

export function SectionsPanel({ admin }: { admin: Admin }) {
  const tr = useT();
  return (
    <Card>
      {Object.entries(admin.config.sections).map(([key, on]) => (
        <div key={key} className={s.toggleRow}>
          <span className={s.toggleLabel}>{SECTION_LABELS[key] ? tr(SECTION_LABELS[key]) : key}</span>
          <Switch
            on={on}
            label={SECTION_LABELS[key] ? tr(SECTION_LABELS[key]) : key}
            onChange={(v) => admin.patchConfig({ sections: { ...admin.config.sections, [key]: v } })}
          />
        </div>
      ))}
    </Card>
  );
}

/* ------------------------------------------------------------------- chat */

export function ChatPanel({ admin }: { admin: Admin }) {
  const tr = useT();
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('Support');

  async function send() {
    if (!body.trim()) return;
    const ok = await admin.create('chat', {
      author,
      body: body.trim(),
      at: new Date().toISOString(),
      fromTeam: true,
    });
    if (ok) setBody('');
  }

  return (
    <Card>
      <div className={s.chatLog}>
        {admin.config.chat.length === 0 && <div className={s.empty}>{tr('No messages.')}</div>}
        {admin.config.chat.map((m) => (
          <div key={m.id} className={[s.bubble, m.fromTeam && s.bubbleTeam].filter(Boolean).join(' ')}>
            <div className={s.bubbleMeta}>
              {m.author} · {new Date(m.at).toLocaleString('fr-FR')}
              <button
                className={p.btn}
                type="button"
                style={{ marginLeft: 8, minHeight: 24, padding: '0 6px', fontSize: 12 }}
                onClick={() => admin.remove('chat', m.id)}
              >{tr('Delete')}</button>
            </div>
            {m.body}
          </div>
        ))}
      </div>

      <div className={`${s.grid} ${s.grid2}`}>
        <Field label={tr('Author')}>
          <input className={s.input} value={author} onChange={(e) => setAuthor(e.target.value)} />
        </Field>
      </div>
      <div style={{ marginTop: 12 }}>
        <Field label={tr('Message')}>
          <textarea className={s.textarea} value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
      </div>
      <div className={p.headActions} style={{ marginTop: 16 }}>
        <button className={`${p.btn} ${p.btnPrimary}`} type="button" disabled={admin.busy || !body.trim()} onClick={send}>
          <Icon name="paper-plane" size={13} />{tr('Send')}</button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ reset */

export function ResetPanel({ admin }: { admin: Admin }) {
  const tr = useT();
  const [confirm, setConfirm] = useState(false);
  return (
    <Card>
      <p style={{ marginTop: 0, fontSize: 16, lineHeight: 1.6 }}>
        Remet la configuration à son état initial : un seul compte à 450 000 €, aucune carte,
        aucune transaction, aucune notification, aucun message.
      </p>
      {!confirm ? (
        <button className={`${p.btn} ${s.danger}`} type="button" onClick={() => setConfirm(true)}>{tr('Reset…')}</button>
      ) : (
        <div className={p.headActions}>
          <button className={p.btn} type="button" onClick={() => setConfirm(false)}>{tr('Cancel')}</button>
          <button
            className={`${p.btn} ${s.danger}`}
            type="button"
            disabled={admin.busy}
            onClick={async () => { await admin.reset(); setConfirm(false); }}
          >{tr('Confirm reset')}</button>
        </div>
      )}
    </Card>
  );
}
