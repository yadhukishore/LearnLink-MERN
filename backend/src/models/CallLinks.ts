// models/CallLinks.ts

import mongoose, { Document, Schema } from 'mongoose';

interface ICallLink extends Document {
  userId: mongoose.Types.ObjectId;
  tutorId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  callLink: string;
  isEnd: boolean;
  createdAt: Date;
}

const CallLinkSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  callLink: { type: String, required: true },
  isEnd: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 60 } 
});

export default mongoose.model<ICallLink>('CallLink', CallLinkSchema);
