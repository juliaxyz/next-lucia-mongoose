import React from 'react';
import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import RegisterForm from '../_components/RegisterForm';

export default async function Register() {
  const { user } = await validateRequest();

  if (user) {
    return redirect('/');
  }

  return (
    <div className='pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen'>
      <Link href='/' className='mb-8 lg:mb-10'>
        <div className='flex flex-col items-center justify-center gap-3'>
          <p className='text-2xl font-bold '>Next.js 14 Auth</p>
          <p className='text-xl'>Lucia Auth, Mongoose with MongoDB Adapter</p>
        </div>
      </Link>
      <div className='w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
          Create an account
        </h2>
        <RegisterForm />
        <div className='flex items-center justify-center w-full my-4'>
          <p>Already have an account?</p>
          <Link
            href='/auth/login'
            className='ml-2 text-indigo-500 font-semibold hover:underline cursor-pointer'
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
