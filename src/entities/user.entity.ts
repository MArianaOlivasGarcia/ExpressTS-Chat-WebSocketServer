import { Schema, model, connect } from 'mongoose';

interface IUser {
  fullName: string;
  email: string;
  password?: string;
  isOnline?: boolean;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: String,
  isOnline: { type: Boolean, default: false },
});

export const User = model<IUser>('User', userSchema);
