'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { Field, RadioCards, Toggle, fieldStyles as f } from '@/components/flow/Fields';
import { Icon } from '@/components/ds/Icon';
import { CardArt } from '@/components/cards/CardArt';
import { useConfig } from '@/components/config/ConfigProvider';
import { BUDGETS } from '@/lib/mock/teamSpend';
import { BRAND } from '@/lib/brand';
import {
  CARD_TYPE_OPTIONS, CARD_FORM_OPTIONS, CONTROL_TYPES, CARDHOLDER_EXTRA,
  NOTE_MAX, CONFIRMATION, RECEIPT_POLICY,
} from '@/lib/mock/cardFlow';
import p from '@/components/ds/Page.module.css';
import s from './IssueCard.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const NEW_LAST4 = '0330';

export default function IssueCardPage() {
  const tr = useT();
  const { config, refresh } = useConfig();
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newLast4, setNewLast4] = useState(NEW_LAST4);
  const [holder, setHolder] = useState('');
  const [nickname, setNickname] = useState('');
  const [note, setNote] = useState('');
  const [credit, setCredit] = useState('Credit');
  const [form, setForm] = useState('Virtual');
  const [agent, setAgent] = useState(false);
  const [controlType, setControlType] = useState('');
  const [budget, setBudget] = useState('');
  const [receiptPolicy, setReceiptPolicy] = useState(false);

  const firstName = holder.split(' ')[0];
  // Control type is required on the original — submitting without it is refused.
  const controlsReady = controlType === 'Spending limit' || (controlType === 'Existing budgets' && !!budget);
  const ready = !!holder && controlsReady;

  function reset() {
    setDone(false);
    setHolder(''); setNickname(''); setNote('');
    setCredit('Credit'); setForm('Virtual'); setAgent(false);
    setControlType(''); setBudget('');
  }

  // Persist the card so it actually appears on the Cards page, then show the
  // confirmation. Config edits go through the administration collection API.
  async function createCard() {
    if (!ready || saving) return;
    setSaving(true);
    const last4 = String(Math.floor(1000 + Math.random() * 9000));
    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          holder,
          last4,
          label: nickname || `${firstName || 'New'}’s ${credit} Card`,
          type: form === 'Physical' ? 'physical' : 'virtual',
          accountId: config.accounts[0]?.id ?? '',
          status: 'active',
          spentThisMonth: 0,
          enabled: true,
        }),
      });
      if (res.ok) {
        setNewLast4(last4);
        await refresh();
      }
    } catch {
      /* Best effort: still show the confirmation below. */
    } finally {
      setSaving(false);
      setDone(true);
    }
  }

  if (done) {
    return (
      <FlowLayout>
        <div className={s.confirm}>
          <CardArt last4={newLast4} />
          <h1 className={s.confirmTitle}>{CONFIRMATION.title}</h1>
          <p className={s.confirmBody}>
            {CONFIRMATION.lines.map((line) => <span key={line}>{line}</span>)}
          </p>

          <div className={s.confirmActions}>
            <button className={p.btn} type="button" onClick={reset}>{CONFIRMATION.secondary}</button>
            <Link className={`${p.btn} ${p.btnPrimary}`} href="/cards">{CONFIRMATION.primary}</Link>
          </div>

          <section className={s.policy}>
            <div className={s.policyHead}>
              <Icon name="receipt" size={14} />
              <span className={s.policyTitle}>{RECEIPT_POLICY.title}</span>
              <button
                className={[s.switch, receiptPolicy && s.switchOn].filter(Boolean).join(' ')}
                type="button"
                role="switch"
                aria-checked={receiptPolicy}
                aria-label={RECEIPT_POLICY.title}
                onClick={() => setReceiptPolicy((v) => !v)}
              >
                <span className={s.knob} />
              </button>
            </div>
            <p className={s.policyBody}>
              Recommended because the IRS requires receipts for transactions $75 and over to be
              eligible for tax deductions. Manage this and other spend policies from your{' '}
              <Link href={RECEIPT_POLICY.policiesHref} className={s.link}>{tr('Policies page')}</Link>.
            </p>
          </section>
        </div>
      </FlowLayout>
    );
  }

  return (
    <FlowLayout
      title={tr('Create a card')}
      aside={
        <div className={s.preview}>
          <CardArt last4="••••" variant={credit === 'Credit' ? 'credit' : 'debit'} />
          <dl className={s.previewMeta}>
            <div><dt>{tr('Cardholder')}</dt><dd>{holder || '—'}</dd></div>
            <div><dt>{tr('Organization')}</dt><dd>{BRAND.productName}</dd></div>
            <div><dt>{tr('Type')}</dt><dd>{form} {credit}</dd></div>
            <div><dt>{tr('Nickname')}</dt><dd>{nickname || `${firstName || 'New'}’s ${credit} Card`}</dd></div>
          </dl>
        </div>
      }
    >
      <div className={f.card}>
        <h2 className={s.section}>{tr('Basics')}</h2>

        <Field label={tr('Cardholder')}>
          <input
            className={f.control}
            id="cardholder"
            placeholder={tr('Cardholder')}
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
          />
        </Field>

        <Field label={tr('Card nickname')}>
          <input
            className={f.control}
            id="nickname"
            placeholder={tr('e.g. Lunch Card')}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Field>

        {/* The original reveals this only once a cardholder is chosen. */}
        {holder && holder !== CARDHOLDER_EXTRA && (
          <Field label={`Let ${firstName} know how to use this card (optional)`}>
            <textarea
              className={s.note}
              id="note"
              maxLength={NOTE_MAX}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <p className={s.noteHint}>
              You have {NOTE_MAX - note.length} characters remaining. We’ll include this in the
              email they receive.
            </p>
          </Field>
        )}

        <h2 className={s.section}>{tr('Type')}</h2>
        <Field label={tr('Credit or Debit')}>
          <RadioCards name="credit" options={CARD_TYPE_OPTIONS} value={credit} onChange={setCredit} />
        </Field>
        <Field label={tr('Virtual or Physical')}>
          <RadioCards name="form" options={CARD_FORM_OPTIONS} value={form} onChange={setForm} />
        </Field>

        <h2 className={s.section}>{tr('Usage (optional)')}</h2>
        <Toggle checked={agent} onChange={setAgent} label={tr('Agent Card')} />

        <h2 className={s.section}>{tr('Spend controls')}</h2>
        <Field label={tr('Control type')}>
          <select
            className={f.control}
            id="control-type"
            value={controlType}
            onChange={(e) => { setControlType(e.target.value); setBudget(''); }}
          >
            <option value="">{tr('Select')}</option>
            {CONTROL_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {!controlType && <p className={s.required}>{tr('Please complete this field')}</p>}
        </Field>

        {controlType === 'Existing budgets' && (
          <Field label={tr('Select budgets')}>
            <select
              className={f.control}
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="">{tr('Select budgets')}</option>
              {BUDGETS.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
            </select>
          </Field>
        )}

        <div className={f.actions}>
          <Link className={p.btn} href="/cards">{tr('Close')}</Link>
          <button
            className={`${p.btn} ${p.btnPrimary}`}
            type="button"
            disabled={!ready || saving}
            onClick={createCard}
          >{saving ? tr('Saving…') : tr('Create card')}</button>
        </div>
      </div>
    </FlowLayout>
  );
}
