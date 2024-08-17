// src/routes/index.ts
import express from 'express';
import authRoutes from './authRoutes';
import adminRoutes from'./adminRoutes';
import tutorRoutes from './tutorRoutes';
import userCourseRoutes from './userCourseRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', (req, res, next) => {
    console.log('Admin route hit:', req.method, req.path);
    next();
  }, adminRoutes);

router.use('/tutor',tutorRoutes);
router.use('/user', userCourseRoutes);
export default router;