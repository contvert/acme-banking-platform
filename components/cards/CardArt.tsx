import { BRAND } from '@/lib/brand';
import s from './CardArt.module.css';

export interface CardArtProps {
  /** Last four digits; the rest of the number stays masked, as on the original. */
  last4?: string;
  /** Small mark in the top-right corner. Defaults to the brand mark. */
  mark?: string;
  /** `full` is the confirmation-size card, `thumb` the row-sized swatch. */
  size?: 'full' | 'thumb';
  variant?: 'credit' | 'debit';
}

/**
 * The card face. Numbers are masked because the reference never exposes a real PAN,
 * and the mark is drawn rather than imported so nothing is loaded from a brand.
 */
export function CardArt({ last4 = '0000', mark = BRAND.cardMark, size = 'full', variant = 'credit' }: CardArtProps) {
  if (size === 'thumb') {
    return (
      <span
        className={[s.thumb, variant === 'debit' && s.thumbDebit].filter(Boolean).join(' ')}
        aria-hidden
      >
        <span className={s.thumbChip} />
      </span>
    );
  }

  return (
    <div className={s.card} role="img" aria-label={`Card ending ${last4}`}>
      <div className={s.mark}>{mark}</div>

      <svg className={s.chip} viewBox="0 0 44 34" aria-hidden>
        <rect x="0.5" y="0.5" width="43" height="33" rx="5" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        <path
          d="M15 .5v33M29 .5v33M.5 11h14M29.5 11h14M.5 23h14M29.5 23h14M15 17h14"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.55"
        />
      </svg>

      <div className={s.number}>
        <span className={s.dots} aria-hidden>•••• •••• ••••</span>
        <span className={s.last4}>{last4}</span>
      </div>

      <div className={s.meta}>
        <span>Exp <span className={s.masked}>••/••</span></span>
        <span>CVC <span className={s.masked}>•••</span></span>
      </div>

      <svg className={s.brand} viewBox="0 0 48 30" aria-hidden>
        <circle cx="18" cy="15" r="13" fill="currentColor" fillOpacity="0.55" />
        <circle cx="30" cy="15" r="13" fill="currentColor" fillOpacity="0.35" />
      </svg>
    </div>
  );
}
