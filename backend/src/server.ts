import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { initializeSocket } from './sockets/socketHandler';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://learn-link-mern.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

initializeSocket(io);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});