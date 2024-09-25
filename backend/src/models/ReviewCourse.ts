// models/ReviewCourse.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IReviewCourse extends Document {
  user: mongoose.Schema.Types.ObjectId;
  course: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment: string;
}

const ReviewCourseSchema = new Schema<IReviewCourse>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model<IReviewCourse>('ReviewCourse', ReviewCourseSchema);
