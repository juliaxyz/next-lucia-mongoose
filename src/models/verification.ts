//models/verification.ts
import mongoose, { Document } from 'mongoose';

interface IVerification extends Document {
  code: string;
  email: string;
  expires_at: Date;
}

const verificationSchema = new mongoose.Schema<IVerification>(
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

export default mongoose.models?.Verification ||
  mongoose.model<IVerification>('Verification', verificationSchema);
