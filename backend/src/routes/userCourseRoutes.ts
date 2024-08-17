// src/routes/userCourseRoutes.ts

import express from 'express';
import { getAllCourses,getCourseDetails } from '../controllers/user/userCourseController'; 

const router = express.Router();

router.get('/courses', getAllCourses);
router.get('/courses/:courseId', getCourseDetails);

export default router;