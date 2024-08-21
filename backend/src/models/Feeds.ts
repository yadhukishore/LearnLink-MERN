import mongoose, { Document, Schema } from 'mongoose';

export interface IFeed extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  files: { url: string; fileType: string }[];
  createdAt: Date;
  updatedAt?: Date;
  isReported: boolean;
  isDeleted:boolean;
}

const feedSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: false }, 
    files: [
      {
        url: { type: String, required: true },
        fileType: { type: String, required: true },
      },
    ],
    isReported: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IFeed>('Feed', feedSchema);
