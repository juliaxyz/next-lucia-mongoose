import React from 'react';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect('/auth/login');
  }
  if (!user.isSuperAdmin) {
    return redirect(`/profile/${user.username}`);
  }

  return <div>Hello Admin</div>;
}
