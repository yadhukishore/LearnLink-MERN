// routes/call.routes.ts
import express from 'express';
import { endCall } from '../controllers/user/userCourseController';

const router = express.Router();

router.put('/end/:roomId', endCall);

export default router;