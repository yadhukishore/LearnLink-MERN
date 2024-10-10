// src/sockets/socketHandler.ts

import { Server, Socket } from 'socket.io';
import Chat from '../models/Chat';
import User from '../models/User';
import Tutor from '../models/Tutor';

export function initializeSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected');

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on('send_message', async ({ roomId, senderId, content, senderRole }) => {
      try {
        console.log('Message received on server:', { roomId, senderId, content, senderRole });

        let chat = await Chat.findOne({ roomId });
        
        if (!chat) {
          console.log('Chat not found! Creating new chat room.');
          chat = new Chat({
            roomId,
            participants: [senderId],
            messages: [],
          });
          await chat.save();
          console.log('New chat room created:', chat);
        }

        let sender;
        if (senderRole === 'Student') {
          sender = await User.findById(senderId);
        } else if (senderRole === 'Tutor') {
          sender = await Tutor.findById(senderId);
        }

        if (!sender) {
          console.log(`${senderRole} not found`);
          throw new Error(`${senderRole} not found`);
        }

        const newMessage = {
          sender: senderId,
          senderRole,
          content,
          timestamp: new Date(),
          isRead: false // Set isRead to false for new messages
        };
        console.log("newMessage", newMessage);
        chat.messages.push(newMessage);
        await chat.save();

        console.log('Message saved to DB:', newMessage);

        const populatedMessage = {
          ...newMessage,
          sender: { _id: sender._id, name: sender.name },
        };
        io.to(roomId).emit('receive_message', populatedMessage);
        console.log(`Message emitted to room: ${roomId}`, populatedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('mark_messages_as_read', async ({ roomId, userId }) => {
      try {
        const chat = await Chat.findOne({ roomId });
        if (chat) {
          let updated = false;
          chat.messages.forEach(message => {
            if (message.sender.toString() !== userId && !message.isRead) {
              message.isRead = true;
              updated = true;
            }
          });
          if (updated) {
            await chat.save();
            io.to(roomId).emit('messages_marked_as_read', userId);
          }
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}