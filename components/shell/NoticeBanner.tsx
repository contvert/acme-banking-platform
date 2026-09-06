'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ds/Icon';
import { useAccounts } from '@/lib/config/adapters';
import { NotaryCertificateModal } from '@/components/notary/NotaryCertificateModal';
import s from './NoticeBanner.module.css';

export function NoticeBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [showCertif, setShowCertif] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 29, hours: 23, minutes: 54, seconds: 30 });
  const accounts = useAccounts();
  const accountBalance = accounts[0]?.balance ?? 450000;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <>
      {showCertif && <NotaryCertificateModal onClose={() => setShowCertif(false)} amount={accountBalance} />}
      <aside className={s.banner} role="alert" aria-label="Notice importante - Délai de retrait">
        <div className={s.content}>
          <Icon name="triangle-exclamation" size={16} className={s.icon} />
          <p className={s.message}>
            Retrait de vos gains à effectuer sous <strong>30 jours</strong>.
            <span className={s.timer}>{timeLeft.days}j {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
          </p>
        </div>
        <div className={s.actions}>
          <button type="button" className={s.certifBtn} onClick={() => setShowCertif(true)}>
            Certificat (PDF)
          </button>
          <Link href="/send-money/transfer" className={s.actionBtn}>
            Effectuer un retrait
          </Link>
          <button
            className={s.closeBtn}
            type="button"
            aria-label="Fermer la notice"
            onClick={() => setDismissed(true)}
          >
            <Icon name="xmark" size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
