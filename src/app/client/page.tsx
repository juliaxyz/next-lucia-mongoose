'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/SessionProvider';

export default function page() {
  const router = useRouter();
  const { user, session } = useSession();

  if (!user) {
    return router.push('/auth/login');
  }

  return <div>{user.email}</div>;
}
