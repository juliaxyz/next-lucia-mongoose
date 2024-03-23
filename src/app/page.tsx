import React from 'react';
import Link from 'next/link';
import { Logout } from '@/app/auth/_components/AuthButtons';
import { validateRequest } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <div className='pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen'>
      <div className='mb-8 lg:mb-10'>
        <div className='flex flex-col items-center justify-center gap-3'>
          <p className='text-2xl font-bold '>Next.js 14 Auth</p>
          <p className='text-xl'>Lucia Auth, Mongoose with MongoDB Adapter</p>
          {!user && (
            <Link
              href='/auth/login'
              className='flex gap-4 items-center justify-center w-full text-indigo-500 font-semibold hover:underline cursor-pointer'
            >
              Go to Login
              <LogIn />
            </Link>
          )}
        </div>
      </div>
      {user && (
        <div className='w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow sm:p-8'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Welcome, {user?.profile?.firstName}!
          </h2>
          <p className=''>Session Data:</p>
          <pre className='text-sm'>{JSON.stringify(user, null, 2)}</pre>
          <Logout />
        </div>
      )}
    </div>
  );
}
