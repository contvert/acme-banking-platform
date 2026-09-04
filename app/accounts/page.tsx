'use client';

import { TopBar } from '@/components/shell/TopBar';
import { useAccounts } from '@/lib/config/adapters';
import { Card } from '@/components/ds/Card';
import { Money } from '@/components/ds/Money';
import s from '@/components/dashboard/Dashboard.module.css';
import t from '@/components/dashboard/TransactionsTable.module.css';

const KIND_LABEL: Record<string, string> = {
  checking: 'Checking', savings: 'Savings', credit: 'Credit', treasury: 'Treasury', other: '',
};

export default function AccountsPage() {
  const ACCOUNTS = useAccounts();
  const total = ACCOUNTS.filter((a) => a.kind !== 'credit')
    .reduce((sum, a) => sum + (a.balance ?? 0), 0);

  return (
    <>
      <TopBar />
      <main className={s.page}>
        <h1 className={s.greeting}>Accounts</h1>
        <Card style={{ marginBottom: 24, maxWidth: 380 }}>
          <div className={s.balanceLabel}>Total balance</div>
          <div className={s.balanceValue}><Money value={total} /></div>
        </Card>

        <div className={t.wrap}>
          <div className={t.scroll}>
            <table className={t.table}>
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Type</th>
                  <th className={t.numeric}>Balance</th>
                  <th>Auto transfer rules</th>
                </tr>
              </thead>
              <tbody>
                {ACCOUNTS.map((a) => (
                  <tr key={a.name}>
                    <td>
                      {a.name}
                      {a.last4 && <span className={t.muted}> ••{a.last4}</span>}
                    </td>
                    <td className={t.muted}>{KIND_LABEL[a.kind]}</td>
                    <td className={t.numeric}><Money value={a.balance} /></td>
                    <td className={t.muted}>{a.rule ?? 'Create rule'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
