import { TopBar } from '@/components/shell/TopBar';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import s from '@/components/dashboard/Dashboard.module.css';

export default function TransactionsPage() {
  return (
    <>
      <TopBar />
      <main className={s.page}>
        <h1 className={s.greeting}>Transactions</h1>
        <TransactionsTable showToolbar />
      </main>
    </>
  );
}
