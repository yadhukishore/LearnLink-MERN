// src/routes/userCourseRoutes.ts

import express from 'express';
import { applyForFinancialAid, getAllCourses,getCourseDetails, getCourseVideos, getCurrentCourses } from '../controllers/user/userCourseController'; 

const router = express.Router();

router.get('/courses', getAllCourses);
router.get('/courses/:courseId', getCourseDetails);
router.post('/apply-financial-aid/:courseId', applyForFinancialAid);
router.get('/course-videos/:courseId', getCourseVideos);
router.get('/current-courses', getCurrentCourses);

export default router;