'use client';

import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { useT } from '@/components/i18n/I18nProvider';

export default function SignupPage() {
  const t = useT();

  return (
    <Page title={t('Open account')}>
      <Card style={{ maxWidth: 560 }}>
        <p style={{ marginTop: 0, fontSize: 16, lineHeight: 1.6 }}>
          {t('Account opening is not wired up — the flow ends here.')}
        </p>
        <p style={{ marginBottom: 0, fontSize: 15, color: 'var(--ds-text-secondary)' }}>
          {t('Every figure in this application is illustrative.')}
        </p>
      </Card>
    </Page>
  );
}
