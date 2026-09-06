import { FlowLayout } from '@/components/flow/FlowLayout';
import { VerifyRecipientForm } from './VerifyRecipientForm';

export default async function VerifyRecipientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <FlowLayout title="Verify recipient RIB">
      <VerifyRecipientForm recipientId={id} />
    </FlowLayout>
  );
}
