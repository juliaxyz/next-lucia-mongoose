'use server';
import { isWithinExpirationDate } from 'oslo';
import { lucia, validateRequest } from '@/lib/auth';
import type { User as LuciaUser } from 'lucia';
import User from '@/models/user';
import Verification from '@/models/verification';
import { cookies } from 'next/headers';
import * as argon2 from 'argon2';
import { sendEmail } from '@/lib/mailer';
import { VerificationSchema } from '@/schemas';
import { redirect } from 'next/navigation';

export type formData = [string, string][];
export type FormState = {
  message?: string | null;
  data?: formData | null;
  fields?: Record<string, string>;
  issues?: string[];
  sessionId?: string;
};

export async function verification(
  prevState: FormState,
  data: formData
): Promise<FormState> {
  const { user } = await lucia.validateSession(prevState.sessionId);

  if (!user) {
    return { message: 'Invalid session' };
  }

  const formData = Object.fromEntries(data);

  const parsed = VerificationSchema.safeParse(formData);

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

  const { code } = parsed.data;

  const validCode = await verifyVerificationCode(user, code);

  if (!validCode) {
    return {
      message: 'Invalid verification code',
    };
  }

  await lucia.invalidateUserSessions(user.id);

  await User.findByIdAndUpdate(
    { _id: user.id },
    {
      isEmailVerified: true,
    }
  );

  const session = await lucia.createSession(user.id, {
    expires: new Date(Date.now() + 1000 * 60 * 24), // 24 hours
  });
  const sessionCookie = lucia.createSessionCookie(session.id);

  redirect('/auth/login');

  return {
    message: 'Email verified',
  };
}

async function verifyVerificationCode(
  user: LuciaUser,
  code: string
): Promise<boolean> {
  const verification = await Verification.findOne({ user_id: user.id });

  if (!verification) {
    return false;
  }

  await Verification.deleteOne({ _id: verification._id });

  if (!isWithinExpirationDate(verification.expires_at)) {
    return false;
  }
  if (verification.email !== user.email) {
    return false;
  }
  return true;
}
