// // src/controllers/chatController.ts
// import { Request, Response } from 'express';
// import Chat from '../../models/Chat';
// import mongoose from 'mongoose';

// export const getChatHistory = async (req: Request, res: Response) => {
//   try {
//     const { userId, tutorId } = req.params;

//     const userObjectId = new mongoose.Types.ObjectId(userId);
//     const tutorObjectId = new mongoose.Types.ObjectId(tutorId);

//     const chat = await Chat.findOne({
//       'participants.userId': userObjectId,
//       'participants.tutorId': tutorObjectId,
//     });

//     if (!chat) {
//       return res.status(404).json({ message: 'Chat not found' });
//     }

//     res.status(200).json({ chatHistory: chat.messages });
//   } catch (error) {
//     console.error('Error fetching chat history:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };