import { Server } from 'socket.io';
import http from 'http';
import app from './app';
import Chat from './models/Chat';
import User from './models/User';
import Tutor from './models/Tutor';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://learn-link-mern.vercel.app',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);//socket on diff route
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
      };
      console.log("newMessage", newMessage);
      chat.messages.push(newMessage);
      await chat.save();
  
      console.log('Message saved to DB:', newMessage);
  
      const populatedMessage = {
        ...newMessage,
        sender: { _id: sender._id, name: sender.name },
      };
      console.log('Message saved to DB:', newMessage);
      io.to(roomId).emit('receive_message', populatedMessage);
      console.log(`Message emitted to room: ${roomId}`, populatedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});