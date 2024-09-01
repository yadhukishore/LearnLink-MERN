// src/routes/userCourseRoutes.ts

import express from 'express';
import { applyForFinancialAid, checkCallLink, createOrder, getAllCourses,getAvailableTimes,getCheckoutCourseDetails,getCourseDetails, getCourseVideos, getCurrentCourses, scheduleCall, unscheduleCall, verifyPayment } from '../controllers/user/userCourseController'; 

const router = express.Router();

router.get('/courses', getAllCourses);
router.get('/courses/:courseId', getCourseDetails);
router.post('/apply-financial-aid/:courseId', applyForFinancialAid);
router.get('/course-videos/:courseId', getCourseVideos);
router.get('/current-courses', getCurrentCourses);
router.get('/checkoutUserCourse/:courseId', getCheckoutCourseDetails);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/available-times/:courseId', getAvailableTimes);
router.post('/schedule-call/:courseId', scheduleCall);
router.post('/unschedule-call/:courseId', unscheduleCall);
router.get('/check-call-link/:userId/:courseId', checkCallLink);

export default router;