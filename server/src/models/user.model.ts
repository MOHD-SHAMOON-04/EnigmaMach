import { Schema, model } from 'mongoose';
import type { UserDoc } from '../types';

const userSchema = new Schema<UserDoc>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = model<UserDoc>('User', userSchema);
