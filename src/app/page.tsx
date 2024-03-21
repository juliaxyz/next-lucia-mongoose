import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logout from '@/app/auth/_components/Logout';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect('/auth/login');
  }
  if (!user.isSuperAdmin) {
    return redirect(`/user/profile/${user.username}`);
  }

  return (
    <div className='pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen'>
      <Link href='/' className='mb-8 lg:mb-10'>
        <div className='flex flex-col items-center justify-center gap-3'>
          <p className='text-2xl font-bold '>Next.js 14 Auth</p>
          <p className='text-xl'>Lucia Auth, Mongoose with MongoDB Adapter</p>
        </div>
      </Link>
      <div className='w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow sm:p-8'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
          Welcome, {user?.profile?.firstName}!
        </h2>
        <p className=''>Session Data:</p>
        <pre className='text-sm'>{JSON.stringify(user, null, 2)}</pre>
        <Logout />
      </div>
    </div>
  );
}
