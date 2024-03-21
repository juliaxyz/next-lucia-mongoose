// adapter for lucia
import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

export const adapter = new MongodbAdapter(
  mongoose.connection.collection('sessions'),
  mongoose.connection.collection('users')
);
