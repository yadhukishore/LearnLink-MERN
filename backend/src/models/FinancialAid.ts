// src/models/FinancialAid.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IFinancialAid extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  reason: string;
  description: string;
  academicEmail?: string;
  careerGoals: string;
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: Date;
  updatedAt: Date;
}

const FinancialAidSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  academicEmail: { type: String },
  careerGoals: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IFinancialAid>('FinancialAid', FinancialAidSchema);