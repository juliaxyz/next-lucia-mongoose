'use server';
import dbConnect from '@/lib/mongodb/mongoose';
import { lucia, validateRequest } from '@/lib/auth';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import User from '@/models/user';
import Profile from '@/models/profile';
import { redirect } from 'next/navigation';
import { RegisterSchema } from '@/schemas';
import { sendEmail } from '@/lib/mailer';

export type formData = [string, string][];
export type FormState = {
  message?: string | null;
  data?: formData | null;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function register(
  prevState: FormState,
  data: formData
): Promise<FormState> {
  const formData = Object.fromEntries(data);

  const parsed = RegisterSchema.safeParse(formData);

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
  if (parsed.data.password !== parsed.data.confirmPassword) {
    return {
      message: 'Passwords do not match',
      fields: parsed.data,
    };
  }

  const { firstName, lastName, email, password } = parsed.data;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return { message: 'Email already in use' };
  }

  const hashedPassword = await new Argon2id().hash(password);

  //firstName and lastName (lowercase) are used to create a username
  //if the username already exists, a number is added to the end of the username
  //john.doe, john.doe1, john.doe2, etc.
  let username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;

  username = await generateUniqueUsername(username);

  try {
    await dbConnect();

    //create a new profile record in the database
    const profile = new Profile({
      firstName,
      lastName,
    });

    //create new user, including profile Id
    const newUser = await new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      username,
      profile: profile._id,
    });

    //add the new userId to the profile and save both records
    profile.user = newUser._id;
    await profile.save();

    const savedUser = await newUser.save();

    //mailer.ts takes care of creating the verification code
    //and sending the email

    const mailResponse = await sendEmail({
      email,
      emailType: 'VERIFY',
      userId: savedUser._id,
    });

    if (!mailResponse) {
      return {
        message: 'Error sending verification email',
      };
    }

    const session = await lucia.createSession(newUser._id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.log('error message', error);
    return {
      message: error,
    };
  }

  redirect('/auth/verify');

  return {
    message: 'User registered',
    data,
  };
}

async function generateUniqueUsername(username) {
  let i = 1;

  while (await User.findOne({ username })) {
    username = `${username}${i}`;

    i++;
  }

  return username;
}
