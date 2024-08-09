import mongoose, { Document, Schema } from 'mongoose';

export interface IFeed extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  image?: string;
  createdAt: Date;
}

const feedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  image: { type: String },
}, { timestamps: true });

export default mongoose.model<IFeed>('Feed', feedSchema);