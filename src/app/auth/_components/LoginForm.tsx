//app/login/page.tsx
'use client';
import React, { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/actions/auth.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthSchema } from '@/schemas';
import { useRouter } from 'next/navigation';
import { LoginButton } from './AuthButtons';
export default function LoginForm() {
  const router = useRouter();

  const [state, formAction] = useFormState(login, {
    message: '',
  });

  const form = useForm<z.output<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(state.fields ?? {}),
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      {state?.message !== '' && !state?.issues && (
        <div className='text-red-500'>{state?.message}</div>
      )}

      {state?.issues && (
        <div className='text-red-500'>
          <ul>
            {state.issues.map((issue) => (
              <li key={issue} className='flex gap-1 h-5'>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        ref={formRef}
        action={formAction}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(() => {
            formAction(new FormData(formRef.current!));
          })(e);
        }}
        className='space-y-2'
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='myEmail@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='****' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoginButton />
      </form>
    </Form>
  );
}
