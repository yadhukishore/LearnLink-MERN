// import mongoose, { Schema, Document } from 'mongoose';

// interface IMessage {
//   sender: string;
//   content: string;
//   timestamp: Date;
// }

// interface IChat extends Document {
//   participants: {
//     userId: mongoose.Types.ObjectId;
//     tutorId: mongoose.Types.ObjectId;
//   };
//   messages: IMessage[];
// }

// const ChatSchema: Schema = new Schema({
//   participants: {
//     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
//   },
//   messages: [{
//     sender: { type: String, required: true },
//     content: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now },
//   }],
// });

// export default mongoose.model<IChat>('Chat', ChatSchema);