'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/lib/brand';
import s from './FlowLayout.module.css';
import { useT } from '@/components/i18n/I18nProvider';

/**
 * Money-movement flows are full-screen overlays on the original, not pages in
 * the app shell: no sidebar, no top bar — just a brand mark,
 * and a close control over a centred column.
 */
export function FlowLayout({
  title,
  children,
  wide = false,
  rail = false,
  aside,
  footer,
}: {
  title?: string;
  children: React.ReactNode;
  /** `aside` turns the flow into the split view used by Create a card. */
  wide?: boolean;
  rail?: boolean;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const t = useT();
  const router = useRouter();

  return (
    <div className={s.root}>

      <div className={aside ? s.split : s.body}>
        <div className={s.pane}>
          <header className={s.head}>
            <Link href="/dashboard" className={s.brand} aria-label={`${BRAND.productName} home`}>
              <img src="/logo.png" alt={BRAND.productName} className="logo-img" style={{ height: 28 }} />
            </Link>
            {!aside && (
              <button
                className={s.close}
                type="button"
                aria-label={t('Close')}
                onClick={() => router.back()}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </header>

          <main
            className={[s.content, wide && s.contentWide, rail && s.contentRail]
              .filter(Boolean)
              .join(' ')}
          >
            {title && <h1 className={s.title}>{title}</h1>}
            {children}
          </main>

          {footer && <div className={s.footer}>{footer}</div>}
        </div>

        {aside && (
          <div className={s.aside}>
            <button
              className={s.closeAside}
              type="button"
              aria-label={t('Close')}
              onClick={() => router.back()}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {aside}
          </div>
        )}
      </div>
    </div>
  );
}
