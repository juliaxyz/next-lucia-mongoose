'use client';

import React, { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { verification } from '@/lib/actions/verification.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { VerificationSchema } from '@/schemas';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/SessionProvider';
import { Loader2, LogIn } from 'lucide-react';

export default function InputOTPForm() {
  const { user, session } = useSession();
  const router = useRouter();

  const [state, formAction] = useFormState(verification, {
    sessionId: session?.id ?? '',
    email: user?.email ?? '',
    message: '',
  });

  const form = useForm<z.output<typeof VerificationSchema>>({
    resolver: zodResolver(VerificationSchema),
    defaultValues: {
      code: '',
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
            formRef?.current?.submit();
          })(e);
        }}
        className='w-2/3 space-y-6'
      >
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Verification Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} />
                      ))}
                    </InputOTPGroup>
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please enter the one-time code sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ValidateButton />
      </form>
    </Form>
  );
}

function ValidateButton() {
  const { pending } = useFormStatus();

  return (
    <Button className='mt-5 w-full' aria-disabled={pending}>
      {pending ? <Loader2 className='animated-spin' /> : 'Validate'}
      <LogIn className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
