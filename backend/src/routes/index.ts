// src/routes/index.ts
import express from 'express';
import authRoutes from './authRoutes';
import adminRoutes from'./adminRoutes';
import tutorRoutes from './tutorRoutes';
import userCourseRoutes from './userCourseRoutes';
import userFeedRoutes from './userFeedRoutes';
import callRoutes from './callRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', (req, res, next) => {
    console.log('Admin route hit:', req.method, req.path);
    next();
  }, adminRoutes);

router.use('/tutor',tutorRoutes);
router.use('/user', userCourseRoutes);
router.use('/user',userFeedRoutes);
router.use('/call',callRoutes);
export default router;