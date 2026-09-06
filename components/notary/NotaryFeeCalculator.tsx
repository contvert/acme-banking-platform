'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ds/Icon';
import s from './NotaryFeeCalculator.module.css';

export function NotaryFeeCalculator({
  initialAmount = 450000,
  maxAmount,
}: {
  initialAmount?: number;
  maxAmount?: number;
}) {
  const [calcAmount, setCalcAmount] = useState(initialAmount);

  useEffect(() => {
    if (initialAmount) {
      setCalcAmount(initialAmount);
    }
  }, [initialAmount]);

  const max = maxAmount ?? initialAmount;
  const fee = calcAmount * 0.06;
  // The fee is added on top: the total to credit is the gain plus the 6 %.
  const total = calcAmount + fee;
  const gainPercent = (calcAmount / total) * 100;
  const feePercent = (fee / total) * 100;

  return (
    <div className={s.calcCard}>
      <div className={s.calcHead}>
        <h3 className={s.calcTitle}>
          <Icon name="sparkles" size={18} />
          Simulateur & Calculateur de Régularisation (6 %)
        </h3>
      </div>

      <div className={s.sliderBox}>
        <div className={s.sliderLabelRow}>
          <span>Montant du virement simulé :</span>
          <span className={s.sliderAmount}>
            {calcAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <input
          type="range"
          min={1000}
          max={max}
          step={1000}
          value={calcAmount}
          onChange={(e) => setCalcAmount(Number(e.target.value))}
          className={s.rangeInput}
        />
      </div>

      <div className={s.gridSummary}>
        <div className={s.sumItem}>
          <span className={s.sumLabel}>Montant Brut Virement</span>
          <span className={s.sumValue}>
            {calcAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className={s.sumItem}>
          <span className={s.sumLabel}>Frais Notariaux (6 %)</span>
          <span className={`${s.sumValue} ${s.sumFee}`}>
            {fee.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div className={s.sumItem}>
          <span className={s.sumLabel}>Montant Total à Créditer</span>
          <span className={`${s.sumValue} ${s.sumNet}`}>
            {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        </div>
      </div>

      <div className={s.distribBar} title="Répartition Gain vs Frais (6 %)">
        <div className={s.distribNet} style={{ width: `${gainPercent}%` }} />
        <div className={s.distribFee} style={{ width: `${feePercent}%` }} />
      </div>
    </div>
  );
}
