'use client';

import { Page, useTabs, Empty } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { TASKS, type Task } from '@/lib/mock/tasks';
import p from '@/components/ds/Page.module.css';

const columns: Column<Task>[] = [
  { key: 'description', header: 'Description', cell: (r) => r.description },
  { key: 'dueBy', header: 'Due by', cell: () => '', muted: true },
  { key: 'received', header: 'Received', sortValue: (r) => r.received, muted: true },
  {
    key: 'action',
    header: '',
    numeric: true,
    cell: (r) => <button className={p.btn} type="button">{r.action}</button>,
  },
];

export default function TasksPage() {
  const tabs = useTabs([
    { label: 'Incomplete', count: TASKS.length },
    { label: 'Completed', count: 0 },
  ]);

  return (
    <Page title="Tasks">
      {tabs.node}
      {tabs.active === 'Incomplete' ? (
        <DataTable rows={TASKS} columns={columns} />
      ) : (
        <Empty>No completed tasks.</Empty>
      )}
    </Page>
  );
}
