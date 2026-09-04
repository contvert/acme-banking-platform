import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { findById } from '@/lib/auth/store';
import { isProfileComplete } from '@/lib/auth/types';
import { profileDraftForUser } from '@/lib/auth/profile';
import { ProfileForm } from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/profile');

  const user = await findById(session.userId);
  if (!user || user.disabled) redirect('/login?next=/profile');
  if (user.role === 'admin') redirect('/settings/my-profile');

  return (
    <ProfileForm
      email={user.username}
      initialProfile={profileDraftForUser(user)}
      initialComplete={isProfileComplete(user)}
      today={new Date().toISOString().slice(0, 10)}
    />
  );
}
