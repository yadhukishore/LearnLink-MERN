// src/routes/userCourseRoutes.ts

import express from 'express';
import { applyForFinancialAid, createOrder, getAllCourses,getCheckoutCourseDetails,getCourseDetails, getCourseVideos, getCurrentCourses, verifyPayment } from '../controllers/user/userCourseController'; 

const router = express.Router();

router.get('/courses', getAllCourses);
router.get('/courses/:courseId', getCourseDetails);
router.post('/apply-financial-aid/:courseId', applyForFinancialAid);
router.get('/course-videos/:courseId', getCourseVideos);
router.get('/current-courses', getCurrentCourses);
router.get('/checkoutUserCourse/:courseId', getCheckoutCourseDetails);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;