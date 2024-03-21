import React from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { validateRequest } from '@/lib/auth';
import Logout from '@/app/auth/_components/Logout';
import { Button } from '@/components/ui/button';

export default async function ProfilePage() {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <main className='max-h-screen max-w-xl mx-auto flex flex-col gap-2 items-center justify-center px-6 pt-8 md:h-screen'>
      <div className='h-16 w-16 bg-white flex items-center justify-center rounded-full overflow-hidden p-2 border-4 border-gray-300'>
        <Image
          src={user?.profile?.avatarUrl}
          alt='profile image'
          width={150}
          height={150}
          className='object-cover'
        />
      </div>
      <h1 className='text-2xl font-bold'>{user?.profile?.name}</h1>

      <p className='font-semibold'>{user?.profile?.bio}</p>
      {user?.isSuperAdmin && (
        <Link
          href='/admin'
          className='cursor-pointer text-indigo-500 hover:underline'
        >
          Go to Admin Dashboard
        </Link>
      )}
      <hr className='w-full my-4' />
      <p className='text-sm text-gray-700'>
        <span className='font-semibold'>Email:</span> {user?.email}
      </p>
      <p className='text-sm'>
        <span className='font-semibold'>Username:</span> {user?.username}
      </p>
      <p className='text-sm'>
        <span className='font-semibold'>City:</span> {user?.profile?.city}
      </p>
      <p className='text-sm'>
        <span className='font-semibold'>Country:</span> {user?.profile?.country}
      </p>
      <p className='text-sm'>
        <span className='font-semibold'>From:</span> {user?.profile?.from}
      </p>
      <div className='w-full mx-auto'>
        <Logout />
      </div>
    </main>
  );
}
