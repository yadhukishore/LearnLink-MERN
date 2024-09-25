// routes/chatRoutes.ts
import express from 'express';
import { createChatRoom, getChatHistory, getTutorChatRooms } from '../controllers/user/chatController';

const router = express.Router();

router.post('/create-room', createChatRoom);
router.get('/history/:roomId', getChatHistory);
router.get('/tutorChat/:tutorId', getTutorChatRooms);


export default router;
