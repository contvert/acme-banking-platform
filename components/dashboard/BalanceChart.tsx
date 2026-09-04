'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { BALANCE_SERIES, BALANCE_RANGE } from '@/lib/mock/dashboard';
import { MoneyCompact } from '@/components/ds/Money';
import s from './BalanceChart.module.css';

const W = 800;
const H = 200;
const PAD_TOP = 12;

/** Catmull-Rom → cubic Bézier, so the line is smooth like the original. */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function BalanceChart() {
  const gid = useId().replace(/:/g, '');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { pts, line, area } = useMemo(() => {
    const vals = BALANCE_SERIES.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    const pts = BALANCE_SERIES.map((d, i) => ({
      x: (i / (BALANCE_SERIES.length - 1)) * W,
      y: PAD_TOP + (1 - (d.value - min) / span) * (H - PAD_TOP - 8),
    }));
    const line = smoothPath(pts);
    return { pts, line, area: `${line} L${W},${H} L0,${H} Z` };
  }, []);

  const ticks = [4, 9, 14, 19, 24].map((i) => BALANCE_SERIES[i]?.date).filter(Boolean);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const i = Math.round(ratio * (BALANCE_SERIES.length - 1));
    setHover(Math.max(0, Math.min(BALANCE_SERIES.length - 1, i)));
  }

  const hp = hover !== null ? pts[hover] : null;

  return (
    <div className={s.wrap} ref={wrapRef}>
      <svg
        className={s.svg}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Balance over the last 30 days"
      >
        <defs>
          <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ds-data-visualization-area-primary-gradient-start)" />
            <stop offset="100%" stopColor="var(--ds-data-visualization-area-primary-gradient-stop)" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#fill-${gid})`} />
        <path
          d={line}
          fill="none"
          stroke="var(--ds-data-visualization-line-primary)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
        {hp && (
          <>
            <line
              x1={hp.x} y1={0} x2={hp.x} y2={H}
              stroke="var(--ds-data-visualization-tick-line)"
              strokeWidth="1" vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={hp.x} cy={hp.y} r="3.5"
              fill="var(--ds-background-surface-raised)"
              stroke="var(--ds-data-visualization-line-primary)"
              strokeWidth="1.5" vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>

      {hover !== null && hp && (
        <div
          className={s.tooltip}
          style={{ left: `${(hp.x / W) * 100}%`, top: `${(hp.y / H) * 100}%` }}
        >
          <div className={s.tooltipDate}>{BALANCE_SERIES[hover].date}</div>
          <MoneyCompact value={BALANCE_RANGE.low + BALANCE_SERIES[hover].value * (BALANCE_RANGE.high - BALANCE_RANGE.low)} />
        </div>
      )}

      <div className={s.axis}>
        {ticks.map((t) => <span key={t}>{t}</span>)}
      </div>
    </div>
  );
}
