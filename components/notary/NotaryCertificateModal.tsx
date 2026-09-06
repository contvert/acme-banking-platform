'use client';

import { useState } from 'react';
import { Icon } from '@/components/ds/Icon';
import s from './NotaryCertificateModal.module.css';

/**
 * The official emblem of the European Union: twelve five-pointed gold stars in
 * a circle on an "reflex blue" field. Drawn inline as SVG so it stays crisp at
 * any size and needs no external asset.
 */
function EUEmblem({ width = 46 }: { width?: number }) {
  const cx = 27;
  const cy = 18;
  const ring = 11.5;
  const star = (sx: number, sy: number, outer = 2.4, inner = 0.95) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = ((-90 + i * 36) * Math.PI) / 180;
      d += `${i === 0 ? 'M' : 'L'}${(sx + r * Math.cos(a)).toFixed(2)} ${(sy + r * Math.sin(a)).toFixed(2)}`;
    }
    return `${d}Z`;
  };
  return (
    <svg
      width={width}
      height={(width * 2) / 3}
      viewBox="0 0 54 36"
      role="img"
      aria-label="Emblème de l’Union européenne"
    >
      <rect width="54" height="36" rx="2.5" fill="#003399" />
      {Array.from({ length: 12 }, (_, k) => {
        const a = (k * 30 * Math.PI) / 180;
        return <path key={k} d={star(cx + ring * Math.sin(a), cy - ring * Math.cos(a))} fill="#FFCC00" />;
      })}
    </svg>
  );
}

export function NotaryCertificateModal({
  onClose,
  amount = 10000,
}: {
  onClose: () => void;
  amount?: number;
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const notaryFee = amount * 0.06;
  // The fee is added on top of the winnings: the amount to credit is the gain
  // plus the 6 %, not the gain minus it.
  const totalAmount = amount + notaryFee;
  const today = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1500);
  };

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-labelledby="certif-title">
      <div className={s.documentCard}>
        <div className={s.watermark}>CERTIFIÉ CONFORME</div>

        <div className={s.docHeader}>
          <div>
            <div className={s.institutionTitle}>UNION EUROPÉENNE</div>
            <div className={s.studyName}>Notariat Européen de Régularisation</div>
            <div className={s.studyMeta}>Conseil des Notariats de l’Union Européenne (CNUE) · Dossier n° 84920/REG</div>
          </div>
          <div className={s.stampBadge}>
            <EUEmblem width={46} />
            <span>Union Européenne</span>
          </div>
        </div>

        <div className={s.docTitleBox}>
          <h2 id="certif-title" className={s.mainTitle}>
            ATTESTATION & NOTIFICATION DE FRAIS NOTARIAUX
          </h2>
          <div className={s.docRef}>RÉFÉRENCE : EU-NOT-2026-84920-REGUL</div>
        </div>

        <div className={s.docBody}>
          <p>
            Nous, <strong>Maître Laurent Dufour</strong>, Notaire agréé auprès du Conseil des Notariats de l’Union Européenne, chargé de la régularisation des opérations bancaires, attestons que le dossier financier d'un montant de <strong>{amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</strong> est actuellement soumis aux formalités légales de contrôle.
          </p>

          <table className={s.calcTable}>
            <thead>
              <tr>
                <th>Désignation des éléments</th>
                <th style={{ textAlign: 'right' }}>Montant (€)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Montant brut de l'opération transmis</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                  {amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </td>
              </tr>
              <tr className={s.totalRow}>
                <td>Frais notariaux de régularisation (6 %)</td>
                <td style={{ textAlign: 'right' }}>
                  {notaryFee.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </td>
              </tr>
              <tr>
                <td>Montant total à créditer (gain + frais)</td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: '#188554' }}>
                  {totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            Conformément aux dispositions réglementaires européennes en vigueur, le règlement des frais notariaux doit être effectué par <strong>dépôt préalable du montant correspondant (6 %)</strong> sur le compte indiqué à cet effet afin de valider définitivement le virement.
          </p>
        </div>

        <div className={s.signatureSection}>
          <div>
            <div style={{ fontSize: 13, color: '#70707d' }}>Fait à Bruxelles, le {today}</div>
           
          </div>
          <div className={s.signBox}>
            <div className={s.signRole}>Pour le Notaire Référent :</div>
            <div className={s.holoSign}>Mᵉ L. Dufour</div>
          </div>
        </div>

        <div className={s.actions}>
          <button type="button" className={s.pdfBtn} style={{ background: '#70707d' }} onClick={onClose}>
            Fermer
          </button>
          <button type="button" className={s.pdfBtn} onClick={handleDownload} disabled={downloading}>
            <Icon name={downloaded ? 'circle-check' : 'file-arrow-up'} size={16} />
            {downloading
              ? 'Génération du PDF...'
              : downloaded
              ? 'Téléchargé (PDF Officiel)'
              : 'Télécharger le Certificat (PDF)'}
          </button>
        </div>
      </div>
    </div>
  );
}
