'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Page } from '@/components/ds/Page';
import { Icon } from '@/components/ds/Icon';
import { useAdmin } from './useAdmin';
import { CompanyPanel, CurrencyPanel, SectionsPanel, ChatPanel, ResetPanel } from './Sections';
import { AccountsPanel, CardsPanel, TransactionsPanel, NotificationsPanel } from './Collections';
import { BankDetailsPanel } from './BankDetails';
import { AccessPanel } from './Access';
import p from '@/components/ds/Page.module.css';
import s from './Admin.module.css';
import { useT } from '@/components/i18n/I18nProvider';

type TabId =
  | 'company' | 'accounts' | 'bank' | 'cards' | 'transactions' | 'access'
  | 'notifications' | 'chat' | 'sections' | 'currency' | 'reset';

export default function AdminPage() {
  const translate = useT();
  const admin = useAdmin();
  const [tab, setTab] = useState<TabId>('accounts');

  const tabs: { id: TabId; label: string; icon: string; count?: number }[] = [
    { id: 'accounts', label: translate('Accounts'), icon: 'building-columns', count: admin.config.accounts.length },
    { id: 'bank', label: translate('Bank details'), icon: 'building-columns', count: (admin.config.bankDetails ?? []).length },
    { id: 'cards', label: translate('Cards'), icon: 'credit-card', count: admin.config.cards.length },
    { id: 'transactions', label: translate('Transactions'), icon: 'right-left', count: admin.config.transactions.length },
    { id: 'notifications', label: translate('Notifications'), icon: 'bell', count: admin.config.notifications.length },
    { id: 'chat', label: translate('Chat'), icon: 'message-lines', count: admin.config.chat.length },
    { id: 'access', label: translate('Client access'), icon: 'users' },
    { id: 'company', label: translate('Company'), icon: 'file-lines' },
    { id: 'sections', label: translate('Sections'), icon: 'grid-2' },
    { id: 'currency', label: translate('Currency'), icon: 'circle-dollar' },
    { id: 'reset', label: translate('Reset'), icon: 'arrow-rotate-left' },
  ];

  return (
    <Page title={translate('Administration')}>
      <div className={s.toolbar}>
        <Link className={p.btn} href="/dashboard">
          <Icon name="eye" size={13} />{translate('View the dashboard')}</Link>
        <span className={s.status}>
          {admin.busy && <span className={s.rowMeta}>{translate('Saving…')}</span>}
          {!admin.busy && admin.saved && <span className={s.ok}>{admin.saved}</span>}
          {admin.error && <span className={s.err}>{admin.error}</span>}
        </span>
      </div>

      <div className={s.layout}>
        <nav className={s.rail} role="tablist" aria-label={translate('Administration sections')}>
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={s.tab}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={15} />
              <span style={{ flex: 1 }}>{t.label}</span>
              {t.count != null && <span className={s.tabCount}>{t.count}</span>}
            </button>
          ))}
        </nav>

        <div className={s.panel}>
          {tab === 'accounts' && <AccountsPanel admin={admin} />}
          {tab === 'bank' && <BankDetailsPanel admin={admin} />}
          {tab === 'cards' && <CardsPanel admin={admin} />}
          {tab === 'transactions' && <TransactionsPanel admin={admin} />}
          {tab === 'notifications' && <NotificationsPanel admin={admin} />}
          {tab === 'chat' && <ChatPanel admin={admin} />}
          {tab === 'access' && <AccessPanel admin={admin} />}
          {tab === 'company' && <CompanyPanel admin={admin} />}
          {tab === 'sections' && <SectionsPanel admin={admin} />}
          {tab === 'currency' && <CurrencyPanel admin={admin} />}
          {tab === 'reset' && <ResetPanel admin={admin} />}
        </div>
      </div>
    </Page>
  );
}
