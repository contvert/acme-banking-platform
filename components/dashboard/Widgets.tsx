'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardFooterLink } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { Money, MoneyCompact } from '@/components/ds/Money';
import { BalanceChart } from './BalanceChart';
import { ACCOUNTS } from '@/lib/mock/accounts';
import { BRAND } from '@/lib/brand';
import {
  TOTAL_BALANCE, BALANCE_RANGE, CREDIT, BILL_PAY, INVOICING, MONEY_MOVEMENT,
} from '@/lib/mock/dashboard';
import s from './Dashboard.module.css';
import { useT } from '@/components/i18n/I18nProvider';

const initials = (name: string) =>
  name.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
      .slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function BalanceCard() {
  const tr = useT();
  const [mode, setMode] = useState<'graph' | 'table'>('graph');
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div>
          <div className={s.balanceLabel}>
            {BRAND.name} balance
            <Icon name="shield-check" size={13} />
          </div>
          <div className={s.balanceValue}>
            <Money value={TOTAL_BALANCE} />
          </div>
        </div>
        <div className={s.toggle} style={{ marginLeft: 'auto' }} role="group" aria-label={tr('Graph or table')}>
          <button className={s.toggleBtn} aria-pressed={mode === 'graph'} aria-label={tr('Balance graph')}
            onClick={() => setMode('graph')}><Icon name="chart-line" size={15} /></button>
          <button className={s.toggleBtn} aria-pressed={mode === 'table'} aria-label={tr('Balance table')}
            onClick={() => setMode('table')}><Icon name="table" size={15} /></button>
        </div>
      </div>

      <div className={s.balanceMeta}>
        <button className={s.rangeBtn} type="button">
          {BALANCE_RANGE.label}<Icon name="chevron-down" size={11} />
        </button>
        <div className={s.statGroup}>
          <span className={s.stat}>
            <Icon name="arrow-up-right" size={12} /><MoneyCompact value={BALANCE_RANGE.high} tone="green" />
          </span>
          <span className={s.stat}>
            <Icon name="arrow-down-right" size={12} /><MoneyCompact value={BALANCE_RANGE.low} tone="red" />
          </span>
        </div>
      </div>

      {mode === 'graph' ? (
        <BalanceChart />
      ) : (
        <div style={{ fontSize: 15 }}>
          {ACCOUNTS.map((a) => (
            <div key={a.name} className={s.row}>
              <span className={s.rowLabel}>{a.name}</span>
              <span className={s.rowValue}><Money value={a.balance} /></span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function AccountsCard() {
  const tr = useT();
  const shown = ACCOUNTS.slice(0, 5);
  const rest = ACCOUNTS.length - shown.length;
  return (
    <Card>
      <CardHeader
        title={tr('Accounts')}
        actions={[{ icon: 'plus', label: tr('Add account') }, { icon: 'ellipsis-vertical', label: tr('More') }]}
      />
      {shown.map((a) => (
        <Link key={a.name} href="/accounts" className={s.row}>
          <span className={s.avatar}>{initials(a.name)}</span>
          <span className={s.rowLabel}>{a.name}</span>
          <span className={s.rowValue}><Money value={a.balance} /></span>
        </Link>
      ))}
      <CardFooterLink href="/accounts">
        {rest > 0 && <span className={s.avatar} style={{ marginRight: 8 }}>+{rest}</span>}
        View all accounts
      </CardFooterLink>
    </Card>
  );
}

export function CreditCardWidget() {
  const tr = useT();
  const usedPct = (CREDIT.balance / CREDIT.limit) * 100;
  const pendingPct = (CREDIT.pending / CREDIT.limit) * 100;
  return (
    <Card>
      <CardHeader
        title={tr('Credit Card')}
        actions={[{ icon: 'credit-card', label: tr('Manage card') }, { icon: 'ellipsis-vertical', label: tr('More') }]}
      />
      <div className={s.balanceValue} style={{ fontSize: 26 }}><Money value={CREDIT.balance} /></div>
      <div className={s.meter}>
        <span className={s.meterFill} style={{ width: `${usedPct}%` }} />
        <span className={s.meterPending} style={{ width: `${pendingPct}%` }} />
      </div>
      <div className={s.legend}>
        <span><i className={s.legendDot} style={{ background: 'var(--ds-data-visualization-segment-primary)' }} />{tr('Balance')}</span>
        <span><i className={s.legendDot} style={{ background: 'var(--ds-data-visualization-segment-secondary)' }} />{tr('Pending')}</span>
        <span className={s.legendRight}><Money value={CREDIT.available} noCents />{tr('available')}</span>
      </div>
      <hr className={s.divider} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div className={s.inline}><Icon name="repeat" size={12} />{tr('Autopay')}</div>
          <div style={{ fontSize: 16, marginTop: 2 }}>{CREDIT.autopayDate}</div>
        </div>
        <button className={s.pill} style={{ marginLeft: 'auto' }} type="button">{tr('Pay')}</button>
      </div>
    </Card>
  );
}

export function BillPayWidget() {
  const tr = useT();
  return (
    <Card>
      <CardHeader
        title={tr('Bill Pay')}
        actions={[{ icon: 'upload', label: tr('Upload bill') }, { icon: 'ellipsis-vertical', label: tr('More') }]}
      />
      <div className={s.statRow}>
        <div><div className={s.statLabel}>{tr('Outstanding')}</div><div className={s.statValue}>{BILL_PAY.outstanding}</div></div>
        <div><div className={s.statLabel}>{tr('Overdue')}</div><div className={s.statValue}>{BILL_PAY.overdue}</div></div>
        <div><div className={s.statLabel}>{tr('Due soon')}</div><div className={s.statValue}>{BILL_PAY.dueSoon ?? '-'}</div></div>
      </div>
      <hr className={s.divider} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div className={s.statLabel}>{tr('Inbox')}</div>
          <div style={{ fontSize: 16 }}>
            {BILL_PAY.inboxItems} items · <MoneyCompact value={BILL_PAY.inboxAmount} />
          </div>
        </div>
        <span style={{ marginLeft: 'auto' }}><CardFooterLink href="/bill-pay">{tr('View')}</CardFooterLink></span>
      </div>
    </Card>
  );
}

export function InvoicingWidget() {
  const tr = useT();
  return (
    <Card>
      <CardHeader
        title={tr('Invoicing')}
        actions={[{ icon: 'plus', label: tr('Create invoice') }, { icon: 'ellipsis-vertical', label: tr('More') }]}
      />
      <div className={s.statRow}>
        <div>
          <div className={s.statLabel}>{tr('Overdue')}</div>
          <div className={s.statValue}>{INVOICING.overdueCount}</div>
          <div className={s.subtle}><Money value={INVOICING.overdueAmount} /></div>
        </div>
        <div>
          <div className={s.statLabel}>{tr('Paid')}</div>
          <div className={s.statValue}>{INVOICING.paidCount}</div>
          <div className={s.subtle}><MoneyCompact value={INVOICING.paidAmount} /></div>
        </div>
      </div>
      <hr className={s.divider} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div className={s.statLabel}>{tr('Open')}</div>
          <div style={{ fontSize: 16 }}>
            {INVOICING.openCount} items · <MoneyCompact value={INVOICING.openAmount} />
          </div>
        </div>
        <span style={{ marginLeft: 'auto' }}><CardFooterLink href="/invoicing">{tr('View')}</CardFooterLink></span>
      </div>
    </Card>
  );
}

function FlowCard({ title, total, top, average, tone }: {
  title: string;
  total: number;
  average: number;
  tone: 'green' | 'red';
  top: { name: string; amount: number }[];
}) {
  const tr = useT();
  return (
    <Card>
      <CardHeader title={<>{title}<Icon name="circle-info" size={12} /></>} />
      <div className={s.balanceValue} style={{ fontSize: 26 }}>
        <Money value={total} tone={tone} />
      </div>
      <div className={s.statLabel} style={{ marginTop: 16 }}>
        {tone === 'green' ? 'Top sources' : 'Top spend'}
      </div>
      {top.map((t) => (
        <div key={t.name} className={s.row}>
          <span className={s.avatar}>{initials(t.name)}</span>
          <span className={s.rowLabel}>{t.name}</span>
          <span className={s.rowValue}><Money value={t.amount} /></span>
        </div>
      ))}
      <CardFooterLink href="/transactions">{tr('View all')}</CardFooterLink>
      <div className={s.subtle}>{tr('Last 3 months average')}<MoneyCompact value={average} />
      </div>
    </Card>
  );
}

export function MoneyMovement() {
  const tr = useT();
  return (
    <>
      <h2 className={s.sectionTitle}>{tr('Money movement')}<span className={s.periodNav}>
          <button className={s.navBtn} aria-label={tr('Previous period')}><Icon name="chevron-left" size={13} /></button>
          {MONEY_MOVEMENT.period}
          <button className={s.navBtn} aria-label={tr('Next period')}><Icon name="chevron-right" size={13} /></button>
        </span>
      </h2>
      <div className={s.grid2}>
        <FlowCard title={tr('Money in')} total={MONEY_MOVEMENT.in.total} top={MONEY_MOVEMENT.in.top}
          average={MONEY_MOVEMENT.in.threeMonthAverage} tone="green" />
        <FlowCard title={tr('Money out')} total={MONEY_MOVEMENT.out.total} top={MONEY_MOVEMENT.out.top}
          average={MONEY_MOVEMENT.out.threeMonthAverage} tone="red" />
      </div>
    </>
  );
}
