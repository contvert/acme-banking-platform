'use client';

import { Page } from '@/components/ds/Page';
import { DataTable, type Column } from '@/components/ds/DataTable';
import { API_TOKENS, type ApiToken } from '@/lib/mock/settingsData';

const columns: Column<ApiToken>[] = [
  { key: 'nickname', header: 'Nickname', sortValue: (r) => r.nickname },
  { key: 'permissions', header: 'Permissions', muted: true },
  { key: 'lastUsed', header: 'Last used', muted: true, sortValue: (r) => r.lastUsed },
  { key: 'createdBy', header: 'Created by', muted: true },
  { key: 'created', header: 'Created date', muted: true },
  { key: 'ips', header: 'Whitelisted IPs', muted: true },
];

export default function TokensPage() {
  return (
    <Page title="API Tokens" actions={[{ label: 'Create an API token', icon: 'plus', primary: true }]}>
      <DataTable rows={API_TOKENS} columns={columns} countLabel={(n) => `${n} tokens`} />
    </Page>
  );
}
