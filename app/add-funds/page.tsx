'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FlowLayout } from '@/components/flow/FlowLayout';
import { Field, fieldStyles as f } from '@/components/flow/Fields';
import { Icon } from '@/components/ds/Icon';
import { useConfig } from '@/components/config/ConfigProvider';
import { formatIban } from '@/lib/config/iban';
import { NotaryFeeCalculator } from '@/components/notary/NotaryFeeCalculator';
import { NotaryCertificateModal } from '@/components/notary/NotaryCertificateModal';
import p from '@/components/ds/Page.module.css';
import s from './AddFunds.module.css';
import { useT } from '@/components/i18n/I18nProvider';

function CopyField({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={[s.copyField, wide && s.copyWide].filter(Boolean).join(' ')}>
      <label className={s.copyLabel}>{label}</label>
      <div className={s.copyRow}>
        <span className={s.copyValue}>{value}</span>
        <button
          className={s.copyBtn}
          type="button"
          aria-label={`Copier ${label}`}
          onClick={() => {
            navigator.clipboard?.writeText(value).catch(() => {});
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
        >
          <Icon name={copied ? 'check' : 'copy'} size={14} />
        </button>
      </div>
    </div>
  );
}

const METHODS: { name: string; tag: string | null; eta: string }[] = [
  { 
    name: 'Virement SEPA', 
    tag: 'Le plus courant', 
    eta: 'Arrive en 1 jour ouvré exact (24 heures ouvrées).' 
  },
  { 
    name: 'Virement instantané', 
    tag: 'Le plus rapide', 
    eta: 'Arrive immédiatement en quelques secondes (24/7).' 
  },
  { 
    name: 'Prélèvement SEPA', 
    tag: null, 
    eta: 'Arrive en 2 à 4 jours ouvrés.' 
  },
];

export default function AddFundsPage() {
  const tr = useT();
  const { config, money, isAdmin } = useConfig();
  const details = config.bankDetails ?? [];
  const [selectedId, setSelectedId] = useState<string>(
    details.find((d) => d.primary)?.id ?? details[0]?.id ?? '',
  );
  const rib = details.find((d) => d.id === selectedId) ?? details[0];
  const account = config.accounts.find((a) => a.currency === rib?.currency) ?? config.accounts[0];

  // État pour la preuve de virement et modale
  const [userReference, setUserReference] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCertifModal, setShowCertifModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setUploadSuccess(true);
    }, 1200);
  };

  const accountBalance = account?.balance ?? 450000;

  return (
    <FlowLayout title={tr('Add funds')}>
      {showCertifModal && <NotaryCertificateModal onClose={() => setShowCertifModal(false)} amount={accountBalance} />}
      {!rib ? (
        <div className={f.card}>
          <p style={{ marginTop: 0, fontSize: 16 }}>
            {tr('No bank details are registered.')}{' '}
            {isAdmin ? (
              <Link href="/admin" className={s.link}>{tr('Add it in administration')}</Link>
            ) : (
              tr('Ask your administrator to add them.')
            )}
          </p>
        </div>
      ) : (
        <>
          <div className={f.card}>
            {details.length > 1 && (
              <Field label={tr('Bank details to show')}>
                <select
                  className={s.select}
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  aria-label={tr('Bank details to show')}
                >
                  {details.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}{d.primary ? ' — principal' : ''}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <div className={s.accountHead}>
              <div>
                <div className={s.accountName}>{rib.label}</div>
                <div className={s.accountMeta}>
                  {rib.holder}
                  {account ? ` · ${money(account.balance, account.currency)}` : ''}
                </div>
              </div>
              {rib.primary && <span className={s.primaryTag}>{tr('Primary')}</span>}
            </div>

            <div className={s.copyGrid}>
              <CopyField label={tr('IBAN')} value={formatIban(rib.iban)} wide />
              {rib.bic && <CopyField label={tr('BIC / SWIFT')} value={rib.bic} />}
              <CopyField label={tr('Account holder')} value={rib.holder} />
              {rib.bankName && <CopyField label={tr('Bank')} value={rib.bankName} />}
              <CopyField label="Référence de virement obligatoire" value="REF-2026-REGUL-84920" wide />
            </div>

            {rib.bankAddress && (
              <p className={s.bankAddress}>{rib.bankAddress}</p>
            )}

            <div className={s.wireActions}>
              <Link className={`${p.btn} ${p.btnPrimary}`} href="/add-funds/wire">
                <Icon name="arrow-down-to-line" size={13} />{tr('Wire instructions')}</Link>
              {isAdmin && (
                <Link className={s.link} href="/admin">{tr('Edit these details')}</Link>
              )}
            </div>
          </div>

          <NotaryFeeCalculator initialAmount={accountBalance} />

          <div className={s.methods}>
            {METHODS.map((m) => (
              <div key={m.name} className={s.method}>
                <span className={s.methodIcon}><Icon name="arrow-right-arrow-left" size={15} /></span>
                <span className={s.methodBody}>
                  <span className={s.methodName}>
                    {m.name}
                    {m.tag && <span className={s.methodTag}>{m.tag}</span>}
                  </span>
                  <span className={s.methodEta}>{m.eta}</span>
                </span>
              </div>
            ))}
          </div>

          <div className={s.uploadSection}>
            <h2 className={s.uploadTitle}>Transmission du justificatif & Preuve de virement</h2>
            <p className={s.uploadDesc}>
              Veuillez indiquer la référence de votre virement d'origine et déposer votre capture d'écran ou reçu bancaire pour la régularisation immédiate de votre dossier.
            </p>

            <form onSubmit={handleSubmitProof}>
              <div className={s.inputGroup}>
                <label htmlFor="user-reference" className={s.inputLabel}>
                  Référence de votre virement d'origine
                </label>
                <input
                  id="user-reference"
                  type="text"
                  className={s.refInput}
                  placeholder="Ex : REF-2026-REGUL-84920 ou libellé saisi lors de votre virement"
                  value={userReference}
                  onChange={(e) => setUserReference(e.target.value)}
                />
              </div>

              <div className={s.inputGroup}>
                <label className={s.inputLabel}>
                  Capture d'écran / Preuve de virement (PDF, PNG, JPG)
                </label>

                {!selectedFile ? (
                  <label className={s.dropBox}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className={s.fileHiddenInput}
                    />
                    <div className={s.dropIcon}>
                      <Icon name="file-arrow-up" size={24} />
                    </div>
                    <div className={s.dropTextTitle}>
                      Glissez-déposez la capture du virement ici ou cliquez pour choisir un fichier
                    </div>
                    <div className={s.dropTextHint}>
                      Formats acceptés : PNG, JPEG, PDF (Taille max : 10 Mo)
                    </div>
                  </label>
                ) : (
                  <div className={s.filePreviewCard}>
                    <div className={s.filePreviewIcon}>
                      <Icon name="clipboard-check" size={24} />
                    </div>
                    <div className={s.filePreviewInfo}>
                      <span className={s.filePreviewName}>{selectedFile.name}</span>
                      <span className={s.filePreviewSize}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} Mo
                      </span>
                    </div>
                    <button
                      type="button"
                      className={s.removeFileBtn}
                      onClick={() => setSelectedFile(null)}
                      title="Supprimer ce fichier"
                    >
                      <Icon name="xmark" size={16} />
                    </button>
                  </div>
                )}
              </div>

              {uploadSuccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className={s.successAlert} role="status">
                    <Icon name="circle-check" size={18} />
                    <span>
                      Votre capture d'écran / preuve de virement a été transmise avec succès ! Reçu officiel d'enregistrement émis.
                    </span>
                  </div>
                  <button
                    type="button"
                    className={p.btn}
                    onClick={() => alert('Téléchargement du Reçu Officiel de Dépôt #REC-84920.pdf...')}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <Icon name="file-arrow-up" size={14} />
                    Télécharger le Reçu Officiel (#REC-84920)
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className={`${p.btn} ${p.btnPrimary}`}
                  style={{ marginTop: 12 }}
                  disabled={!selectedFile || isSubmitting}
                >
                  <Icon name="paper-plane" size={14} />
                  {isSubmitting ? 'Transmission en cours...' : 'Transmettre la preuve de virement'}
                </button>
              )}
            </form>
          </div>
        </>
      )}
    </FlowLayout>
  );
}
