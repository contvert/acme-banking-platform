'use client';

import Link from 'next/link';
import { TopBar } from '@/components/shell/TopBar';
import { Icon } from '@/components/ds/Icon';
import { useConfig } from '@/components/config/ConfigProvider';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import {
  LiveBalanceCard, LiveAccountsCard, LiveTransactions, LiveNotifications, LiveChat,
} from '@/components/dashboard/LiveWidgets';
import { CreditCardWidget, BillPayWidget, InvoicingWidget, MoneyMovement } from '@/components/dashboard/Widgets';
import { QUICK_ACTIONS } from '@/lib/mock/nav';
import { USER } from '@/lib/mock/dashboard';
import { Card } from '@/components/ds/Card';
import s from '@/components/dashboard/Dashboard.module.css';

export default function DashboardPage() {
  const { config, user, isAdmin } = useConfig();
  const { sections } = config;
  const greetingName = user?.displayName.trim() || USER.firstName;

  return (
    <>
      <TopBar />
      <main className={s.page}>
        <h1 className={s.greeting}>Bonjour, {greetingName}</h1>

        <div className={s.actionRow}>
          {QUICK_ACTIONS.map((a, i) => (
            <Link
              key={a.href}
              href={a.href}
              className={[s.pill, i === 0 && s.pillPrimary].filter(Boolean).join(' ')}
            >
              <Icon name={a.icon} size={13} />
              {a.label}
            </Link>
          ))}
          {isAdmin && (
            <Link className={s.ghost} href="/admin">
              <Icon name="gear" size={13} />
              Configurer
            </Link>
          )}
        </div>

        <div className={s.grid2}>
          <div style={{ display: 'grid', gap: 'var(--ds-space-250)' }}>
            <LiveBalanceCard />
            {sections.balanceChart && (
              <Card>
                <BalanceChart />
              </Card>
            )}
          </div>
          {sections.accounts && <LiveAccountsCard />}
        </div>

        {(sections.creditCard || sections.billPay || sections.invoicing) && (
          <div className={s.grid3}>
            {sections.creditCard && <CreditCardWidget />}
            {sections.billPay && <BillPayWidget />}
            {sections.invoicing && <InvoicingWidget />}
          </div>
        )}

        {(sections.notifications || sections.chat) && (
          <div className={s.grid2}>
            {sections.notifications && <LiveNotifications />}
            {sections.chat && <LiveChat />}
          </div>
        )}

        {sections.moneyMovement && <MoneyMovement />}

        {sections.transactions && (
          <>
            <h2 className={s.sectionTitle}>Transactions</h2>
            <LiveTransactions />
          </>
        )}
      </main>
    </>
  );
}
