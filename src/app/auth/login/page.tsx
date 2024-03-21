//app/login/page.tsx

import React from 'react';
import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '../_components/LoginForm';

export default async function Login() {
  const { user } = await validateRequest();

  if (user) {
    return redirect(`/user/profile/${user.username}`);
  }
  return (
    <div className='pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 dark:bg-gray-900 md:h-screen'>
      <Link href='/' className='mb-8 lg:mb-10'>
        <div className='flex flex-col items-center justify-center gap-3'>
          <p className='text-2xl font-bold '>Next.js 14 Auth</p>
          <p className='text-xl'>Lucia Auth, Mongoose with MongoDB Adapter</p>
        </div>
      </Link>
      <div className='w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
          Sign in to your account
        </h2>
        <LoginForm />
        <div className='flex justify-center items-center w-full'>
          <p>Don't have an account?</p>
          <Link
            href='/auth/register'
            className='ml-2 text-indigo-500 font-semibold hover:underline cursor-pointer'
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
