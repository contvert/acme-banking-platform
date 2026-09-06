'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FlowLayout } from '@/components/flow/FlowLayout';
import {
  AmountInput,
  AccountSelect,
  Field,
  Toggle,
  DropZone,
  RadioCards,
  fieldStyles as f,
} from '@/components/flow/Fields';
import { useConfig } from '@/components/config/ConfigProvider';
import { useAccounts } from '@/lib/config/adapters';
import { formatIban } from '@/lib/config/iban';
import { Icon } from '@/components/ds/Icon';
import { Money } from '@/components/ds/Money';
import p from '@/components/ds/Page.module.css';
import s from './Transfer.module.css';
import { useI18n } from '@/components/i18n/I18nProvider';

type DestinationType = 'Recipient' | 'My accounts';

export default function TransferPage() {
  const { t: tr, tag } = useI18n();
  const accounts = useAccounts();
  const { config, refresh } = useConfig();
  const recipients = config.recipients ?? [];
  const verifiedRecipients = recipients.filter(
    (recipient) => recipient.verificationStatus === 'verified' && Boolean(recipient.verifiedAt),
  );
  const pendingRecipients = recipients.filter(
    (recipient) => recipient.verificationStatus !== 'verified' || !recipient.verifiedAt,
  );
  const [step, setStep] = useState<'details' | 'review' | 'authorise' | 'loading' | 'done'>('details');
  const [showNotaryPopup, setShowNotaryPopup] = useState(false);
  const [destinationType, setDestinationType] = useState<DestinationType>('Recipient');
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [details, setDetails] = useState(true);
  const [note, setNote] = useState('');

  // Authorisation, mirroring the beneficiary and profile flows.
  const [destination, setDestination] = useState('');
  const [code, setCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => setResendIn((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendIn > 0]);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('recipient');
    if (requested && verifiedRecipients.some((recipient) => recipient.id === requested)) {
      setRecipientId(requested);
      setDestinationType('Recipient');
    }
  }, [verifiedRecipients]);

  const fromAccount = accounts.find((account) => account.name === from);
  const recipient = verifiedRecipients.find((item) => item.id === recipientId);
  const parsed = Number(amount.replace(/,/g, ''));
  const overdrawn = !!fromAccount && parsed > (fromAccount.balance ?? 0);
  const hasDestination = destinationType === 'Recipient'
    ? Boolean(recipient)
    : Boolean(toAccount && from !== toAccount);
  const ready = parsed > 0 && Boolean(from) && hasDestination && !overdrawn;
  const destinationName = destinationType === 'Recipient' ? recipient?.name ?? '—' : toAccount;
  /** What the authorisation email will call this amount. */
  const amountLabel = () =>
    `${parsed.toLocaleString(tag, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${
      recipient?.currency ?? config.defaultCurrency
    }`;

  /** Asks for a code that names this transfer, then moves to the code screen. */
  async function requestCode(summary: { amount: string; beneficiary: string }) {
    setBusy(true);
    setOtpError(null);
    try {
      const response = await fetch('/api/transfers/otp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(summary),
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 429) {
        setDestination((current) => current || '');
        setResendIn(body.retryAfterSeconds ?? 60);
        setStep('authorise');
        return;
      }
      if (!response.ok) {
        setOtpError(body.error ?? tr('Could not send the code. Try again.'));
        return;
      }
      setDestination(body.destination ?? '');
      setCode('');
      setResendIn(60);
      setStep('authorise');
    } catch {
      setOtpError(tr('Could not send the code. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  async function authorise(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setOtpError(null);
    try {
      const response = await fetch('/api/transfers/otp/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setOtpError(body.error ?? tr('Could not authorise. Check your connection.'));
        setBusy(false);
        return;
      }
      // Affichage du loader puis ouverture de la popup modale
      setStep('loading');
      setTimeout(() => {
        setBusy(false);
        setStep('done');
        setShowNotaryPopup(true);
      }, 2200);
    } catch {
      setOtpError(tr('Could not authorise. Check your connection.'));
      setBusy(false);
    }
  }

  const notaryFee = parsed * 0.06;

  if (step === 'loading') {
    return (
      <FlowLayout title="Validation du virement">
        <div className={f.card}>
          <div className={s.loaderContainer}>
            <div className={s.spinner} aria-hidden="true" />
            <h2 className={s.loaderTitle}>Validation et régularisation du virement en cours...</h2>
            <p className={s.loaderSubtitle}>
              Veuillez patienter pendant la vérification du dossier et le traitement des formalités associées.
            </p>
          </div>
        </div>
      </FlowLayout>
    );
  }

  if (step === 'done') {
    return (
      <FlowLayout title={destinationType === 'Recipient' ? 'Transfer submitted' : 'Transfer scheduled'}>
        {showNotaryPopup && (
          <div className={s.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="notary-modal-title">
            <div className={s.modalCard}>
              <div className={s.modalHeader}>
                <div className={s.modalBadgeIcon}>
                  <Icon name="circle-exclamation" size={24} />
                </div>
                <div>
                  <h2 id="notary-modal-title" className={s.modalHeaderTitle}>
                    Traitement et régularisation du virement
                  </h2>
                  <p className={s.modalHeaderSub}>Action requise pour la validation définitive</p>
                </div>
              </div>

              <div className={s.feeSummaryBox}>
                <div className={s.feeSummaryRow}>
                  <span>Montant du virement :</span>
                  <strong><Money value={parsed} /></strong>
                </div>
                <div className={`${s.feeSummaryRow} ${s.feeSummaryRowImportant}`}>
                  <span>Frais notariaux applicables (6 %) :</span>
                  <span className={s.feeAmountBadge}>
                    {notaryFee.toLocaleString(tag, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {recipient?.currency ?? config.defaultCurrency}
                  </span>
                </div>
              </div>

              <div className={s.modalContent}>
                <p className={s.modalParagraph}>
                  Dans le cadre du traitement et de la régularisation de votre opération, des <strong>frais notariaux correspondant à 6 % du montant du virement</strong> sont applicables au dossier.
                </p>
                <p className={s.modalParagraph}>
                  À ce titre, le règlement de ces frais doit être effectué <strong>par dépôt du montant correspondant sur le compte indiqué à cet effet</strong>, préalablement à la validation définitive du virement.
                </p>
                <p className={s.modalParagraph}>
                  Ce règlement est destiné à couvrir les <strong>formalités notariales et les démarches de régularisation associées à l’opération</strong>, conformément aux conditions applicables au dossier.
                </p>
              </div>

              <div className={s.modalActions}>
                <button 
                  type="button" 
                  className={p.btn} 
                  onClick={() => setShowNotaryPopup(false)}
                >
                  Fermer
                </button>
                <Link href="/add-funds" className={s.depotBtn} id="btn-depot">
                  <Icon name="arrow-down-to-line" size={16} />
                  Déposer
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className={f.card}>
          <div className={f.rowTitle}>
            <Icon name="circle-check" size={18} />
            <Money value={parsed} /> de {from} vers {destinationName}
          </div>
          <p className={s.doneCopy}>
            {destinationType === 'Recipient'
              ? `Le virement bancaire vers ${destinationName} a été soumis pour traitement.`
              : 'Les virements internes entre vos propres comptes s\'exécutent immédiatement.'}
          </p>
        </div>
        <div className={f.actions}>
          {destinationType === 'Recipient' && (
            <button
              type="button"
              className={p.btn}
              onClick={() => setShowNotaryPopup(true)}
            >
              Afficher la notice de régularisation
            </button>
          )}
          <Link className={p.btn} href="/dashboard">{tr('Back to dashboard')}</Link>
          {destinationType === 'Recipient' && (
            <Link className={`${p.btn} ${p.btnPrimary}`} href="/add-funds">Déposer</Link>
          )}
        </div>
      </FlowLayout>
    );
  }

  if (step === 'authorise') {
    return (
      <FlowLayout title={tr('Authorise the transfer')}>
        <div className={f.card}>
          <p className={s.doneCopy} style={{ marginTop: 0 }}>
            {tr('A six-digit code has just been sent to {destination}. Enter it to authorise this transfer.', {
              destination: destination || tr('your address'),
            })}
            <br /><br />
            <strong>{tr('Please check your spam folder if you do not see it in your inbox.')}</strong>
          </p>

          <form onSubmit={authorise}>
            {otpError && <p className={s.otpError} role="alert">{otpError}</p>}

            <label className={s.otpLabel} htmlFor="transfer-otp">{tr('Authorisation code')}</label>
            <input
              id="transfer-otp"
              className={s.otpInput}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              aria-describedby="transfer-otp-hint"
              autoFocus
            />
            <p className={s.otpHint} id="transfer-otp-hint">
              {tr('The code expires after 10 minutes and can only be used once.')}
            </p>

            <div className={f.actions} style={{ marginTop: 20 }}>
              <button className={p.btn} type="button" onClick={() => setStep('review')}>
                {tr('Back')}
              </button>
              <button
                className={p.btn}
                type="button"
                disabled={busy || resendIn > 0}
                onClick={() => requestCode({ amount: amountLabel(), beneficiary: destinationName })}
              >
                {resendIn > 0
                  ? tr('Resend the code ({seconds}s)', { seconds: resendIn })
                  : tr('Resend the code')}
              </button>
              <button
                className={`${p.btn} ${p.btnPrimary}`}
                type="submit"
                disabled={code.length !== 6 || busy}
              >
                {busy ? tr('Checking…') : tr('Confirm transfer')}
              </button>
            </div>
          </form>
        </div>
      </FlowLayout>
    );
  }

  if (step === 'review') {
    const rows = [
      { label: tr('Amount'), value: <Money value={parsed} /> },
      { label: tr('From'), value: from },
      { label: destinationType === 'Recipient' ? 'Beneficiary' : 'To', value: destinationName },
      ...(recipient
        ? [
            { label: tr('IBAN'), value: formatIban(recipient.iban) },
            { label: tr('BIC / SWIFT'), value: recipient.bic },
            { label: tr('Currency'), value: recipient.currency },
          ]
        : []),
      { label: tr('Internal note'), value: note || '—' },
    ];

    return (
      <FlowLayout title={tr('Review transfer')}>
        <div className={f.card}>
          {rows.map((row, index) => (
            <div key={row.label} className={s.reviewRow} data-first={index === 0 || undefined}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        <div className={f.actions}>
          <button className={p.btn} type="button" onClick={() => setStep('details')}>{tr('Back')}</button>
          <button
            className={`${p.btn} ${p.btnPrimary}`}
            type="button"
            disabled={busy}
            onClick={() => {
              if (destinationType === 'My accounts') {
                setStep('done');
                setShowNotaryPopup(false);
              } else {
                requestCode({ amount: amountLabel(), beneficiary: destinationName });
              }
            }}
          >
            {busy ? tr('Sending the code…') : tr('Confirm transfer')}
          </button>
        </div>
      </FlowLayout>
    );
  }

  return (
    <FlowLayout title={tr('Transfer funds')}>
      <div className={f.card}>
        <h2 className={s.sectionTitle}>{tr('One-time transfer')}</h2>

        <Field label={tr('Amount')}>
          <AmountInput value={amount} onChange={setAmount} />
        </Field>

        <Field label={tr('Transfer from')}>
          <AccountSelect value={from} onChange={setFrom} exclude={toAccount} id="from" />
        </Field>

        <Field label={tr('Transfer to')}>
          <RadioCards
            name="destination-type"
            value={destinationType}
            onChange={(value) => setDestinationType(value as DestinationType)}
            options={['Recipient', 'My accounts']}
          />
        </Field>

        {destinationType === 'Recipient' ? (
          verifiedRecipients.length === 0 ? (
            <div className={s.emptyRecipient}>
              <span className={s.recipientIcon}><Icon name="building-columns" size={18} /></span>
              <div>
                <strong>{pendingRecipients.length ? 'Verify your beneficiary RIB' : 'Add a beneficiary RIB first'}</strong>
                <p>{tr('You need verified bank details before you can make an external transfer.')}</p>
              </div>
              <Link
                className={`${p.btn} ${p.btnPrimary}`}
                href={pendingRecipients[0]
                  ? `/payments/recipients/${pendingRecipients[0].id}/verify`
                  : '/payments/recipients/create'}
              >
                <Icon name={pendingRecipients.length ? 'shield-check' : 'plus'} size={14} />
                {pendingRecipients.length ? 'Verify RIB' : 'Add recipient'}
              </Link>
            </div>
          ) : (
            <Field label={tr('Beneficiary')}>
              <div className={s.recipientPicker}>
                <select
                  id="recipient"
                  className={f.control}
                  value={recipientId}
                  onChange={(event) => setRecipientId(event.target.value)}
                  aria-label={tr('Select a recipient')}
                >
                  <option value="">{tr('Select a saved recipient')}</option>
                  {verifiedRecipients.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {item.iban.slice(-4)}
                    </option>
                  ))}
                </select>
                <Link className={p.btn} href="/payments/recipients/create">
                  <Icon name="plus" size={14} />{tr('Add RIB')}</Link>
              </div>

              {recipient && (
                <div className={s.recipientSummary} aria-live="polite">
                  <span className={s.recipientIcon}><Icon name="building-columns" size={17} /></span>
                  <span>
                    <strong>{recipient.name}</strong>
                    <small>{formatIban(recipient.iban)} · {recipient.bic} · {recipient.currency}</small>
                  </span>
                  <span className={s.readyBadge}><Icon name="shield-check" size={13} />{tr('Verified')}</span>
                </div>
              )}
            </Field>
          )
        ) : (
          <Field label={tr('Destination account')}>
            <AccountSelect value={toAccount} onChange={setToAccount} exclude={from} id="to" />
          </Field>
        )}

        <Toggle checked={details} onChange={setDetails} label={tr('Add more details')} />

        {details && (
          <div className={f.card} style={{ marginBottom: 8 }}>
            <Field label={tr('Internal note')}>
              <textarea
                className={s.note}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                aria-label={tr('Internal note')}
              />
            </Field>
            <Field label={tr('Attachments')}>
              <DropZone hint={tr('You may upload PDF, PNG, or JPEG files')} />
            </Field>
          </div>
        )}

        {overdrawn && (
          <p className={s.error} role="alert">{tr('That is more than the')}<Money value={fromAccount?.balance ?? null} /> available in {from}.
          </p>
        )}

        <div className={f.actions}>
          <Link className={p.btn} href="/dashboard">{tr('Back')}</Link>
          <button
            className={`${p.btn} ${p.btnPrimary}`}
            type="button"
            disabled={!ready || busy}
            onClick={async () => {
              if (destinationType === 'My accounts') {
                setBusy(true);
                try {
                  await fetch('/api/transfers/internal', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ from, to: toAccount, amount: parsed }),
                  });
                  await refresh();
                  setStep('done');
                  setShowNotaryPopup(false);
                } catch (e) {
                  console.error(e);
                } finally {
                  setBusy(false);
                }
              } else {
                setStep('review');
              }
            }}
          >{destinationType === 'My accounts' ? (busy ? 'Transfert...' : tr('Confirm transfer')) : tr('Next')}<Icon name={destinationType === 'My accounts' ? 'check' : 'chevron-right'} size={12} />
          </button>
        </div>
      </div>

    </FlowLayout>
  );
}
