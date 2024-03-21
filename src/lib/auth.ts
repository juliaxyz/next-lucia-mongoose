//lib.auth.ts

import { Lucia } from 'lucia';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { Session, LuciaUser } from 'lucia';
import { adapter } from './adapter';
import dbConnect from '@/lib/mongodb/mongoose';
import User from '@/models/user';
import Profile from '@/models/profile';

async function getProfileAttributes(user: LuciaUser) {
  await dbConnect();
  if (!user) {
    return null;
  }

  try {
    const profileData = await Profile.findById(user.profile)
      .select('-createdAt -updatedAt -__v')
      .lean()
      .exec();

    if (!profileData) {
      return user.profile;
    }
    return profileData;
  } catch (error) {
    console.log('error message', error);
    return null;
  }
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production' || true,
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      email: attributes.email,
      emailVerified: attributes.isEmailVerified,
      username: attributes.username,
      profile: attributes.profile,
      isSuperAdmin: attributes.isSuperAdmin,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: LuciaUser; session: Session } | { user: null; session: null }
  > => {
    await dbConnect();
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    if (!result) {
      return {
        user: null,
        session: null,
      };
    }

    const profileAttributes = await getProfileAttributes(result.user);

    if (!profileAttributes) {
      return {
        user: null,
        session: null,
      };
    }
    result.user.profile = {
      ...profileAttributes,
      //We return "id" instead of "_id" to be consistent with
      //the way lucia returns the user object.
      //aternatively, don't return profile id at all
      //depending on the requirements of the app
      _id: undefined,
      id: profileAttributes._id,
    };

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch (error) {
      console.log('error message', error);
    }
    return JSON.parse(JSON.stringify(result));
  }
);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  username: string;
  isEmailVerified: boolean;
  isSuperAdmin: boolean;
  profile: string;
}
