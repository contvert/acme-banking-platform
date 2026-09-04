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

const initials = (name: string) =>
  name.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
      .slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function BalanceCard() {
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
        <div className={s.toggle} style={{ marginLeft: 'auto' }} role="group" aria-label="Graph or table">
          <button className={s.toggleBtn} aria-pressed={mode === 'graph'} aria-label="Balance graph"
            onClick={() => setMode('graph')}><Icon name="chart-line" size={15} /></button>
          <button className={s.toggleBtn} aria-pressed={mode === 'table'} aria-label="Balance table"
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
  const shown = ACCOUNTS.slice(0, 5);
  const rest = ACCOUNTS.length - shown.length;
  return (
    <Card>
      <CardHeader
        title="Accounts"
        actions={[{ icon: 'plus', label: 'Add account' }, { icon: 'ellipsis-vertical', label: 'More' }]}
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
  const usedPct = (CREDIT.balance / CREDIT.limit) * 100;
  const pendingPct = (CREDIT.pending / CREDIT.limit) * 100;
  return (
    <Card>
      <CardHeader
        title="Credit Card"
        actions={[{ icon: 'credit-card', label: 'Manage card' }, { icon: 'ellipsis-vertical', label: 'More' }]}
      />
      <div className={s.balanceValue} style={{ fontSize: 26 }}><Money value={CREDIT.balance} /></div>
      <div className={s.meter}>
        <span className={s.meterFill} style={{ width: `${usedPct}%` }} />
        <span className={s.meterPending} style={{ width: `${pendingPct}%` }} />
      </div>
      <div className={s.legend}>
        <span><i className={s.legendDot} style={{ background: 'var(--ds-data-visualization-segment-primary)' }} />Balance</span>
        <span><i className={s.legendDot} style={{ background: 'var(--ds-data-visualization-segment-secondary)' }} />Pending</span>
        <span className={s.legendRight}><Money value={CREDIT.available} noCents /> available</span>
      </div>
      <hr className={s.divider} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div className={s.inline}><Icon name="repeat" size={12} />Autopay</div>
          <div style={{ fontSize: 16, marginTop: 2 }}>{CREDIT.autopayDate}</div>
        </div>
        <button className={s.pill} style={{ marginLeft: 'auto' }} type="button">Pay</button>
      </div>
    </Card>
  );
}

export function BillPayWidget() {
  return (
    <Card>
      <CardHeader
        title="Bill Pay"
        actions={[{ icon: 'upload', label: 'Upload bill' }, { icon: 'ellipsis-vertical', label: 'More' }]}
      />
      <div className={s.statRow}>
        <div><div className={s.statLabel}>Outstanding</div><div className={s.statValue}>{BILL_PAY.outstanding}</div></div>
        <div><div className={s.statLabel}>Overdue</div><div className={s.statValue}>{BILL_PAY.overdue}</div></div>
        <div><div className={s.statLabel}>Due soon</div><div className={s.statValue}>{BILL_PAY.dueSoon ?? '-'}</div></div>
      </div>
      <hr className={s.divider} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div className={s.statLabel}>Inbox</div>
          <div style={{ fontSize: 16 }}>
            {BILL_PAY.inboxItems} items · <MoneyCompact value={BILL_PAY.inboxAmount} />
          </div>
        </div>
        <span style={{ marginLeft: 'auto' }}><CardFooterLink href="/bill-pay">View</CardFooterLink></span>
      </div>
    </Card>
  );
}

export function InvoicingWidget() {
  return (
    <Card>
      <CardHeader
        title="Invoicing"
        actions={[{ icon: 'plus', label: 'Create invoice' }, { icon: 'ellipsis-vertical', label: 'More' }]}
      />
      <div className={s.statRow}>
        <div>
          <div className={s.statLabel}>Overdue</div>
          <div className={s.statValue}>{INVOICING.overdueCount}</div>
          <div className={s.subtle}><Money value={INVOICING.overdueAmount} /></div>
        </div>
        <div>
          <div className={s.statLabel}>Paid</div>
          <div className={s.statValue}>{INVOICING.paidCount}</div>
          <div className={s.subtle}><MoneyCompact value={INVOICING.paidAmount} /></div>
        </div>
      </div>
      <hr className={s.divider} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div className={s.statLabel}>Open</div>
          <div style={{ fontSize: 16 }}>
            {INVOICING.openCount} items · <MoneyCompact value={INVOICING.openAmount} />
          </div>
        </div>
        <span style={{ marginLeft: 'auto' }}><CardFooterLink href="/invoicing">View</CardFooterLink></span>
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
      <CardFooterLink href="/transactions">View all</CardFooterLink>
      <div className={s.subtle}>
        Last 3 months average <MoneyCompact value={average} />
      </div>
    </Card>
  );
}

export function MoneyMovement() {
  return (
    <>
      <h2 className={s.sectionTitle}>
        Money movement
        <span className={s.periodNav}>
          <button className={s.navBtn} aria-label="Previous period"><Icon name="chevron-left" size={13} /></button>
          {MONEY_MOVEMENT.period}
          <button className={s.navBtn} aria-label="Next period"><Icon name="chevron-right" size={13} /></button>
        </span>
      </h2>
      <div className={s.grid2}>
        <FlowCard title="Money in" total={MONEY_MOVEMENT.in.total} top={MONEY_MOVEMENT.in.top}
          average={MONEY_MOVEMENT.in.threeMonthAverage} tone="green" />
        <FlowCard title="Money out" total={MONEY_MOVEMENT.out.total} top={MONEY_MOVEMENT.out.top}
          average={MONEY_MOVEMENT.out.threeMonthAverage} tone="red" />
      </div>
    </>
  );
}
