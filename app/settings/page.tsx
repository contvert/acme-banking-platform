'use client';

import Link from 'next/link';
import { Page, SectionTitle } from '@/components/ds/Page';
import { Icon } from '@/components/ds/Icon';
import { BRAND } from '@/lib/brand';
import s from './Settings.module.css';
import { useT } from '@/components/i18n/I18nProvider';
import type { Message } from '@/lib/i18n/messages/catalog';

interface Entry {
  /** Catalogued: this table is defined once, and read in five languages. */
  label: Message;
  href: string;
  icon: string;
  description: Message;
}

const GROUPS: { title: Message; entries: Entry[] }[] = [
  {
    title: 'Company',
    entries: [
      { label: 'Company profile', href: '/settings/company-profile', icon: 'building-columns', description: 'Legal name, address and business details' },
      { label: 'Team', href: '/settings/users', icon: 'users', description: 'Invite people and manage their access' },
      { label: 'Departments', href: '/settings/departments', icon: 'grid-2', description: 'Group members for reporting and budgets' },
      { label: 'Roles', href: '/settings/roles', icon: 'shield-check', description: 'Define what each role is allowed to do' },
    ],
  },
  {
    title: 'Money',
    entries: [
      { label: 'Approvals', href: '/settings/approvals', icon: 'clipboard-check', description: 'Require sign-off above a threshold' },
      { label: 'Controls', href: '/settings/controls', icon: 'lock', description: 'Payment limits and dual approval' },
      { label: 'Categories', href: '/settings/categories', icon: 'tag', description: 'Bookkeeping categories for transactions' },
      { label: 'Plan & Billing', href: '/settings/plan-and-billing', icon: 'credit-card', description: `Your ${BRAND.plan} plan and invoices` },
    ],
  },
  {
    title: 'Security',
    entries: [
      { label: 'Account security', href: '/settings/account-security', icon: 'key', description: 'Password, 2FA and active sessions' },
      { label: 'Vault', href: '/settings/vault', icon: 'lock', description: 'Stored documents and sensitive data' },
      { label: 'API tokens', href: '/settings/tokens', icon: 'terminal', description: 'Tokens for programmatic access' },
      { label: 'Webhooks', href: '/settings/webhooks', icon: 'link', description: 'Event notifications to your systems' },
    ],
  },
  {
    title: 'Other',
    entries: [
      { label: 'Documents & Data', href: '/settings/documents', icon: 'file-lines', description: 'Statements, tax forms and exports' },
      { label: 'Integrations', href: '/settings/integrations', icon: 'grid-2', description: 'Connected accounting and payroll tools' },
      { label: 'Notifications', href: '/settings/notifications', icon: 'bell', description: 'What you get emailed about' },
      { label: 'Referrals', href: '/settings/referrals', icon: 'gift', description: 'Earn a bonus for each referral' },
    ],
  },
];

export default function SettingsPage() {
  const t = useT();
  return (
    <Page title={t('Settings')}>
      {GROUPS.map((g) => (
        <div key={g.title}>
          <SectionTitle>{t(g.title)}</SectionTitle>
          <div className={s.grid}>
            {g.entries.map((e) => (
              <Link key={e.href} href={e.href} className={s.entry}>
                <span className={s.entryIcon}><Icon name={e.icon} size={16} /></span>
                <span className={s.entryText}>
                  <span className={s.entryLabel}>{t(e.label)}</span>
                  <span className={s.entryDesc}>{t(e.description)}</span>
                </span>
                <Icon name="chevron-right" size={13} />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </Page>
  );
}
