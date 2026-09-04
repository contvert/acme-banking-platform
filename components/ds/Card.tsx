import Link from 'next/link';
import { Icon } from './Icon';
import s from './Card.module.css';

export function Card({ children, className, style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return <section className={[s.card, className].filter(Boolean).join(' ')} style={style}>{children}</section>;
}

export function CardHeader({ title, badge, actions }: {
  title: React.ReactNode; badge?: React.ReactNode; actions?: { icon: string; label: string }[];
}) {
  return (
    <header className={s.header}>
      <h2 className={s.title}>{title}{badge}</h2>
      {actions && (
        <div className={s.actions}>
          {actions.map((a) => (
            <button key={a.label} className={s.iconBtn} type="button" aria-label={a.label}>
              <Icon name={a.icon} size={15} />
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export function CardFooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={s.footerLink}>
      {children}<Icon name="chevron-right" size={12} />
    </Link>
  );
}
