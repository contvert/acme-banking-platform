import s from './Money.module.css';

type Tone = 'default' | 'green' | 'red' | 'muted' | 'auto';

export interface MoneyProps {
  /** Value in major units. `null` renders an em dash. */
  value: number | null | undefined;
  /** `auto` colours positive green and negative red, matching the original. */
  tone?: Tone;
  /** Render cents raised, as the original does everywhere money is shown. */
  superscriptCents?: boolean;
  /** Force a leading + on positive values. */
  signed?: boolean;
  strikethrough?: boolean;
  /** Drop the cents entirely, as in "$21,249 available". */
  noCents?: boolean;
  className?: string;
}

/**
 * The money primitive. Two details carry the original's character:
 * cents are set as a raised superscript at 0.73em, and the whole
 * figure is tabular with -0.03em tracking so columns align.
 */
export function Money({
  value,
  tone = 'default',
  superscriptCents = true,
  signed = false,
  strikethrough = false,
  noCents = false,
  className,
}: MoneyProps) {
  if (value === null || value === undefined) {
    return <span className={[s.dollarDisplay, s.muted, className].filter(Boolean).join(' ')}>—</span>;
  }

  const negative = value < 0;
  const abs = Math.abs(value);
  const [int, frac = '00'] = abs.toFixed(2).split('.');
  const grouped = Number(int).toLocaleString('en-US');

  const resolved: Tone = tone === 'auto' ? (negative ? 'red' : 'green') : tone;
  const cls = [
    s.dollarDisplay,
    resolved === 'green' && s.green,
    resolved === 'red' && s.red,
    resolved === 'muted' && s.muted,
    strikethrough && s.strikethrough,
    className,
  ].filter(Boolean).join(' ');

  // The original uses U+2212 MINUS SIGN, not a hyphen.
  const sign = negative ? '\u2212' : signed ? '+' : '';

  return (
    <span className={cls}>
      {sign}
      <span className={s.integerDelimiter}>$</span>
      {grouped}
      {noCents ? null : superscriptCents ? (
        <span className={s.superscript}>
          <span className={s.fractionalDelimiter} />
          {frac}
        </span>
      ) : (
        <>.{frac}</>
      )}
    </span>
  );
}

/** Compact form used in charts and summary tiles: $1.8M, −$488K. */
export function MoneyCompact({ value, tone = 'default' }: { value: number; tone?: Tone }) {
  const negative = value < 0;
  const abs = Math.abs(value);
  const [n, unit] =
    abs >= 1e9 ? [abs / 1e9, 'B'] : abs >= 1e6 ? [abs / 1e6, 'M'] : abs >= 1e3 ? [abs / 1e3, 'K'] : [abs, ''];
  // $1.8M and $12.3K keep a decimal; $488K and $6K do not.
  const rounded = Math.round(n * 10) / 10;
  const digits = Number.isInteger(rounded) ? 0 : 1;
  const resolved: Tone = tone === 'auto' ? (negative ? 'red' : 'green') : tone;
  const cls = [
    s.dollarDisplay,
    resolved === 'green' && s.green,
    resolved === 'red' && s.red,
    resolved === 'muted' && s.muted,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      {negative ? '\u2212' : ''}${n.toFixed(digits)}{unit}
    </span>
  );
}
