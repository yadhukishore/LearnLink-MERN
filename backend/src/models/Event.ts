import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  imageUrl: string;
  type: 'latest_update' | 'special_offer';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['latest_update', 'special_offer'], required: true },
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', EventSchema);