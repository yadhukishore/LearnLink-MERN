import mongoose, { Document, Schema } from 'mongoose';

export interface IScheduledTime extends Document {
  tutorId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  bookedUsers: mongoose.Types.ObjectId[];
}

const ScheduledTimeSchema: Schema = new Schema({
  tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isBooked: { type: Boolean, default: false },
  bookedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model<IScheduledTime>('ScheduledTime', ScheduledTimeSchema);