import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { BRAND } from '@/lib/brand';

export default function SignupPage() {
  return (
    <Page title="Open account">
      <Card style={{ maxWidth: 560 }}>
        <p style={{ marginTop: 0, fontSize: 16, lineHeight: 1.6 }}>
          Account opening is not
          wired up — the flow ends here.
        </p>
        <p style={{ marginBottom: 0, fontSize: 15, color: 'var(--ds-text-secondary)' }}>
          Every figure in this application is illustrative.
        </p>
      </Card>
    </Page>
  );
}
