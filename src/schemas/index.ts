import { z } from 'zod';

export const RegisterSchema = z
  .object({
    firstName: z.string().trim().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().trim().email().min(1, { message: 'Email is required' }),
    password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain an uppercase letter',
      })
      .refine((value) => /[a-z]/.test(value), {
        message: 'Password must contain a lowercase letter',
      })
      .refine((value) => /[0-9]/.test(value), {
        message: 'Password must contain a number',
      })
      .refine((value) => /[^A-Za-z0-9]/.test(value), {
        message: 'Password must contain a special character',
      }),
    confirmPassword: z.string().min(1, { message: 'This field is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const VerificationSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: 'Your one-time verification code must be 6 characters.',
    }),
});

export const AuthSchema = z.object({
  email: z.string().trim().email().min(1, { message: 'Email is required' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain an uppercase letter',
    })
    .refine((value) => /[a-z]/.test(value), {
      message: 'Password must contain a lowercase letter',
    })
    .refine((value) => /[0-9]/.test(value), {
      message: 'Password must contain a number',
    })
    .refine((value) => /[^A-Za-z0-9]/.test(value), {
      message: 'Password must contain a special character',
    }),
});
