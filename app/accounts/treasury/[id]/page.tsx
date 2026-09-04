import { redirect } from 'next/navigation';
export default async function TreasuryParty({ params }: { params: Promise<{ id: string }> }) {
  await params;
  redirect('/accounts/treasury');
}
