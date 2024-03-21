//models/session.ts
import mongoose, { Document } from 'mongoose';

interface ISession extends Document {
  user_id: string;
  expires_at: Date;
}

export const sessionSchema = new mongoose.Schema<ISession>(
  {
    user_id: {
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

export default mongoose.models?.Session ||
  mongoose.model<ISession>('Session', sessionSchema);
