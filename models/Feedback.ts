import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  userType: string;
  country?: string;
  feedback: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAvatar: { type: String },
    userType: { type: String, default: 'User' },
    country: { type: String, default: 'Unknown' },
    feedback: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isApproved: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);