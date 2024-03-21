//models/profile.ts
import mongoose, { Document, HookNextFunction } from 'mongoose';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  NOT_SPECIFIED = 'not_specified',
}

interface IProfile extends Document {
  firstName: string;
  lastName: string;
  name: string;
  gender: Gender;
  bio: string;
  profileCover: string;
  avatarUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    website: string;
  };
  from: string;
  city: string;
  country: string;
}

const profileSchema = new mongoose.Schema<IProfile>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      lowercase: true,
    },
    bio: {
      type: String,
      trim: true,
      default: "Hi there! I'm new here.",
    },
    profileCover: {
      type: String,
    },
    avatarUrl: {
      type: String,
      default: '/images/profile-icon.png',
    },
    socialLinks: {
      type: {
        instagram: String,
        facebook: String,
        youtube: String,
        website: String,
      },
      default: {},
    },
    from: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.pre<IProfile>('save', async function (next: HookNextFunction) {
  if (!this.isModified('name')) {
    this.name = this.firstName + ' ' + this.lastName;
  }
  next();
});

export default mongoose.models?.Profile ||
  mongoose.model<IProfile>('Profile', profileSchema);
