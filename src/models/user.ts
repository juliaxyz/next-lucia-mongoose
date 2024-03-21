//models/user.ts
import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
  password: string;
  email: string;
  username: string;
}

export type User = mongoose.Document & IUser;

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.User ||
  mongoose.model<IUser>('User', userSchema);
