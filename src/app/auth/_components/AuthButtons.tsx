'use client';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { logout } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut } from 'lucide-react';

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className='mt-4 w-full' aria-disabled={pending} type='submit'>
      {pending ? <Loader2 className='animated-spin' /> : 'Sign In'}
      <LogIn className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}

export function Logout() {
  return (
    <form action={logout} className=''>
      <LogoutButton />
    </form>
  );
}
function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button className='mt-4 w-full' aria-disabled={pending} type='submit'>
      {pending ? <Loader2 className='animated-spin' /> : 'Sign Out'}
      <LogOut className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
