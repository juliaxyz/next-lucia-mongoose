'use server';
import dbConnect from '@/lib/mongodb/mongoose';
import { lucia, validateRequest } from '@/lib/auth';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import User from '@/models/user';
import Profile from '@/models/profile';
import Verification from '@/models/verification';
import { redirect } from 'next/navigation';
import { AuthSchema } from '@/schemas';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { sendEmail } from '@/lib/mailer';

export type formData = [string, string][];
export type FormState = {
  message?: string | null;
  data?: formData | null;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function login(prevState: any, data: formData): Promise<any> {
  const formData = Object.fromEntries(data);

  const parsed = AuthSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: 'Invalid form data',
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
  const { email, password } = parsed.data;

  await dbConnect();

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return {
      message: 'Invalid credentials',
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    password
  );

  if (!validPassword) {
    return {
      message: 'Invalid credentials',
    };
  }

  if (!existingUser.isEmailVerified) {
    return {
      message:
        'Email is not verified, please check your email or request another verification email',
    };
  }

  const session = await lucia.createSession(existingUser._id, {
    expiresIn: 60 * 60 * 24, // 1 day
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    message: 'Logged in successfully',
    data,
  };
}

export async function logout(): Promise<any> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      message: 'Not logged in',
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return {
    message: 'Logged out',
  };
}
