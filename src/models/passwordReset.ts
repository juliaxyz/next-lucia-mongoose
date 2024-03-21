//models/passwordReset.ts
import mongoose, { Document } from 'mongoose';

interface IPasswordReset extends Document {
  code: string;
  email: string;
  expires_at: Date;
}

const passwordResetSchema = new mongoose.Schema<IPasswordReset>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    code: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.PasswordReset ||
  mongoose.model<IPasswordReset>('PasswordReset', passwordResetSchema);
