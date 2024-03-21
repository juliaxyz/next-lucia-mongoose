import React from 'react';
import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';

export default async function RequestCode() {
  const { user } = await validateRequest();
  const isVerified: boolean = !!user && user?.isEmailVerified;

  if (isVerified) {
    redirect('/auth/login');
    return {
      message: 'Email already verified. Redirecting to login page...',
    };
  }
  return <div>Request Code </div>;
}
