'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { AmountInput, AccountSelect, Field, Toggle, DropZone, fieldStyles as f } from '@/components/flow/Fields';
import { useAccounts } from '@/lib/config/adapters';
import { Icon } from '@/components/ds/Icon';
import { Money } from '@/components/ds/Money';
import p from '@/components/ds/Page.module.css';

export default function TransferPage() {
  const ACCOUNTS = useAccounts();
  const [step, setStep] = useState<'details' | 'review' | 'done'>('details');
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [details, setDetails] = useState(true);
  const [note, setNote] = useState('');

  const fromAccount = ACCOUNTS.find((a) => a.name === from);
  const parsed = Number(amount.replace(/,/g, ''));
  const overdrawn = !!fromAccount && parsed > (fromAccount.balance ?? 0);
  const ready = parsed > 0 && !!from && !!to && from !== to && !overdrawn;

  if (step === 'done') {
    return (
      <FlowLayout title="Transfer scheduled">
        <div className={f.card}>
          <div className={f.rowTitle}>
            <Icon name="circle-check" size={18} />
            <Money value={parsed} /> from {from} to {to}
          </div>
          <p style={{ fontSize: 15, color: 'var(--ds-text-secondary)', marginBottom: 0 }}>
            Internal transfers between your own accounts settle immediately.
          </p>
        </div>
        <div className={f.actions}>
          <Link className={p.btn} href="/dashboard">Back to dashboard</Link>
          <Link className={`${p.btn} ${p.btnPrimary}`} href="/transactions">View transactions</Link>
        </div>
      </FlowLayout>
    );
  }

  if (step === 'review') {
    return (
      <FlowLayout title="Review transfer">
        <div className={f.card}>
          {[
            { label: 'Amount', value: <Money value={parsed} /> },
            { label: 'From', value: from },
            { label: 'To', value: to },
            { label: 'Internal note', value: note || '—' },
          ].map((r, i) => (
            <div
              key={r.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--ds-border-default)',
              }}
            >
              <span style={{ flex: 1, fontSize: 15, color: 'var(--ds-text-secondary)' }}>{r.label}</span>
              <span style={{ fontSize: 16, color: 'var(--ds-text-emphasized)' }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div className={f.actions}>
          <button className={p.btn} type="button" onClick={() => setStep('details')}>Back</button>
          <button className={`${p.btn} ${p.btnPrimary}`} type="button" onClick={() => setStep('done')}>
            Confirm transfer
          </button>
        </div>
      </FlowLayout>
    );
  }

  return (
    <FlowLayout title="Transfer funds">
      <div className={f.card}>
        <h2 style={{ fontSize: 18, fontWeight: 400, margin: '0 0 20px', color: 'var(--ds-text-emphasized)' }}>
          One-time transfer
        </h2>

        <Field label="Amount">
          <AmountInput value={amount} onChange={setAmount} />
        </Field>

        <Field label="Transfer from">
          <AccountSelect value={from} onChange={setFrom} exclude={to} id="from" />
        </Field>

        <Field label="Transfer to">
          <AccountSelect value={to} onChange={setTo} exclude={from} id="to" />
        </Field>

        <Toggle checked={details} onChange={setDetails} label="Add more details" />

        {details && (
          <div className={f.card} style={{ marginBottom: 8 }}>
            <Field label="Internal note">
              <textarea
                className={f.amount}
                style={{
                  width: '100%', minHeight: 64, resize: 'vertical', padding: 12,
                  border: '1px solid var(--ds-border-input)',
                  borderRadius: 'var(--ds-border-radius-medium)',
                  background: 'var(--ds-background-input)',
                }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                aria-label="Internal note"
              />
            </Field>
            <Field label="Attachments">
              <DropZone hint="You may upload PDF, PNG, or JPEG files" />
            </Field>
          </div>
        )}

        {overdrawn && (
          <p style={{ fontSize: 15, color: 'var(--ds-text-error)' }}>
            That is more than the <Money value={fromAccount?.balance ?? null} /> available in {from}.
          </p>
        )}

        <div className={f.actions}>
          <Link className={p.btn} href="/dashboard">Back</Link>
          <button
            className={`${p.btn} ${p.btnPrimary}`}
            type="button"
            disabled={!ready}
            onClick={() => setStep('review')}
          >
            Next <Icon name="chevron-right" size={12} />
          </button>
        </div>
      </div>

      <button className={f.rowCard} type="button" style={{ marginTop: 16 }}>
        <span className={f.rowIcon}><Icon name="repeat" size={15} /></span>
        <span className={f.rowBody}>
          <span className={f.rowTitle}>Auto transfer rule</span>
        </span>
        <Icon name="chevron-right" size={14} />
      </button>
    </FlowLayout>
  );
}
