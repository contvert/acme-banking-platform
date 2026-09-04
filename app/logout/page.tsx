import Link from 'next/link';
import { Page } from '@/components/ds/Page';
import { Card } from '@/components/ds/Card';
import { BRAND } from '@/lib/brand';
import p from '@/components/ds/Page.module.css';

export default function LogoutPage() {
  return (
    <Page title="Signed out">
      <Card style={{ maxWidth: 520 }}>
        <p style={{ marginTop: 0, fontSize: 16, lineHeight: 1.6 }}>
          You have been signed out of {BRAND.productName}.
        </p>
        <Link className={`${p.btn} ${p.btnPrimary}`} href="/dashboard">Back to the dashboard</Link>
      </Card>
    </Page>
  );
}
