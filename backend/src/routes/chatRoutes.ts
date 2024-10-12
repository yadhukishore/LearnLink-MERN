// routes/chatRoutes.ts
import express from 'express';
import { checkUnreadMessages, createChatRoom, getChatHistory, getTutorChatRooms } from '../controllers/user/chatController';

const router = express.Router();

router.post('/create-room', createChatRoom);
router.get('/history/:roomId', getChatHistory);
router.get('/tutorChat/:tutorId', getTutorChatRooms);
router.get('/checkUnreadMessages/:tutorId', checkUnreadMessages);


export default router;
