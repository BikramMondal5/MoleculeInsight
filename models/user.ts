import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  googleId?: string;
  email: string;
  password?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider: 'local' | 'google';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    name: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String, default: null },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);