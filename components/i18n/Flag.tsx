import type { LocaleMeta } from '@/lib/i18n/locales';

/**
 * Flags drawn inline rather than set as emoji: Windows ships no glyphs for
 * regional-indicator pairs, so an emoji flag degrades to the bare letters
 * "GB" on the very machines this runs on. Drawn shapes also stay crisp at
 * 16px and cost no network request under the app's stylesheet policy.
 *
 * Each is a 3:2 field on a 60x40 grid, simplified to the elements that make
 * it recognisable at this size — the emblems on the Portuguese and Spanish
 * flags are suggested rather than reproduced.
 */

const FLAGS: Record<LocaleMeta['country'], React.ReactNode> = {
  GB: (
    <>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" strokeWidth="3.4" />
      <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="7.5" />
    </>
  ),
  FR: (
    <>
      <rect width="20" height="40" fill="#002395" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#ED2939" />
    </>
  ),
  IT: (
    <>
      <rect width="20" height="40" fill="#008C45" />
      <rect x="20" width="20" height="40" fill="#F4F5F0" />
      <rect x="40" width="20" height="40" fill="#CD212A" />
    </>
  ),
  PT: (
    <>
      <rect width="60" height="40" fill="#DA291C" />
      <rect width="24" height="40" fill="#046A38" />
      <circle cx="24" cy="20" r="8.5" fill="none" stroke="#FFE900" strokeWidth="2.6" />
      <path d="M20.9 16.9h6.2v6.2h-6.2z" fill="#fff" stroke="#DA291C" strokeWidth="1.8" />
      <circle cx="24" cy="20" r="1.5" fill="#DA291C" />
    </>
  ),
  ES: (
    <>
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
      <rect x="12" y="15" width="10" height="10" rx="1.4" fill="#AA151B" />
    </>
  ),
};

export function Flag({
  country,
  size = 18,
  className,
}: {
  country: LocaleMeta['country'];
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 40"
      width={size}
      height={Math.round((size * 2) / 3)}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ borderRadius: 2, flex: '0 0 auto', display: 'block' }}
    >
      {/* Keeps a pale flag legible against the surface it sits on. */}
      <rect width="60" height="40" fill="#fff" />
      {FLAGS[country]}
      <rect
        width="60"
        height="40"
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="2"
        rx="1"
      />
    </svg>
  );
}
