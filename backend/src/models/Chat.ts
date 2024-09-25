// models/Chat.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IMessage {
  sender: mongoose.Types.ObjectId;
  senderRole: 'Student' | 'Tutor';
  content: string;
  timestamp: Date;
}

interface IChat extends Document {
  roomId: string;
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
}

const ChatSchema: Schema = new Schema({
  roomId: { type: String, required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['Student', 'Tutor'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

export default mongoose.model<IChat>('Chat', ChatSchema);