// controllers/chatController.ts
import { Request, Response } from 'express';
import Chat from '../../models/Chat';
import User from '../../models/User';
import Tutor from '../../models/Tutor';

export const createChatRoom = async (req: Request, res: Response) => {
  try {
    const { userId, tutorId } = req.body;
    const roomId = `${userId}_${tutorId}`;
    console.log(`userId: ${userId} , tutorId: ${tutorId}`);
    console.log(`Room: ${roomId}`);

    let chat = await Chat.findOne({ roomId });

    if (!chat) {
      chat = new Chat({
        roomId,
        participants: [userId, tutorId],
        messages: []
      });
      await chat.save();
    }
    console.log("Success");
    res.status(200).json({ success: true, roomId });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  console.log("Get chat history")
  try {
    const { roomId } = req.params;
    const chat = await Chat.findOne({ roomId });

    if (!chat) {
      console.log("Chat not found!");
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    const populatedMessages = await Promise.all(chat.messages.map(async (message) => {
      let sender;
      if (message.senderRole === 'Student') {
        sender = await User.findById(message.sender);
      } else if (message.senderRole === 'Tutor') {
        sender = await Tutor.findById(message.sender);
      }

      return {
        _id: message.timestamp,
        content: message.content,
        timestamp: message.timestamp,
        senderRole: message.senderRole,
        sender: sender ? { _id: sender._id, name: sender.name } : null,
      };
    }));

    res.status(200).json({ success: true, chat: { ...chat.toObject(), messages: populatedMessages } });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getTutorChatRooms = async (req: Request, res: Response) => {
  try {
    console.log("getTutorChatRooms");
    const { tutorId } = req.params;
    console.log("TutorId", tutorId);

    // Find chats where roomId ends with the tutorId (e.g., userId_tutorId)
    const chats = await Chat.find({ roomId: { $regex: `_${tutorId}$` } })
      .sort({ 'messages.timestamp': -1 });

    const chatRooms = await Promise.all(chats.map(async (chat) => {
      // Find the student by excluding the tutorId from participants
      const studentId = chat.participants.find(p => p.toString() !== tutorId);
      const student = await User.findById(studentId);

      const lastMessage = chat.messages[chat.messages.length - 1];
      let sender;
      if (lastMessage.senderRole === 'Student') {
        sender = await User.findById(lastMessage.sender);
      } else if (lastMessage.senderRole === 'Tutor') {
        sender = await Tutor.findById(lastMessage.sender);
      }

      return {
        roomId: chat.roomId,
        userId: student?.id.toString(),
        userName: student?.name || 'Unknown Student',
        lastMessage: lastMessage?.content || 'No messages yet',
        lastMessageTime: lastMessage?.timestamp || null,
        lastMessageSender: sender ? sender.name : 'Unknown'
      };
    }));

    console.log("chatRooms", chatRooms);

    res.status(200).json({ success: true, chatRooms });
  } catch (error) {
    console.error('Error fetching tutor chat rooms:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};