import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { initializeSocket } from './sockets/socketHandler';

const server = http.createServer(app);
const allowedOrigins = process.env.ORIGIN_URLS?.split(',') || [];
console.log("allowedOrigins:",allowedOrigins);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

initializeSocket(io);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});