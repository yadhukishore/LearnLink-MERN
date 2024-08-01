// src/routes/index.ts
import express from 'express';
import authRoutes from './authRoutes';
import adminRoutes from'./adminRoutes';
import tutorRoutes from './tutorRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', (req, res, next) => {
    console.log('Admin route hit:', req.method, req.path);
    next();
  }, adminRoutes);

export default router;
router.use('/tutor',tutorRoutes)