'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { Icon } from '@/components/ds/Icon';
import { DEPARTMENTS } from '@/lib/mock/settingsData';
import { TEAM } from '@/lib/mock/team';
import { useT } from '@/components/i18n/I18nProvider';

export default function DepartmentsPage() {
  const tr = useT();
  return (
    <Page
      title={tr('Departments')}
      actions={[
        { label: tr('Connect HR system'), icon: 'link' },
        { label: tr('Add department'), icon: 'plus', primary: true, href: '/settings/users/invite/advisors/details' },
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {DEPARTMENTS.map((d) => {
          const members = TEAM.filter((m) => m.department === d);
          return (
            <Card key={d}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="grid-2" size={15} />
                <span style={{ fontSize: 16, color: 'var(--ds-text-emphasized)' }}>{d}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 15, color: 'var(--ds-text-secondary)' }}>
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </div>
            </Card>
          );
        })}
      </div>
    </Page>
  );
}
