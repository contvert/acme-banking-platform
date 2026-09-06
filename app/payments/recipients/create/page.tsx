import { FlowLayout } from '@/components/flow/FlowLayout';
import { RecipientForm } from './RecipientForm';

export default function CreateRecipientPage() {
  return (
    <FlowLayout title="Add a recipient">
      <RecipientForm />
    </FlowLayout>
  );
}
