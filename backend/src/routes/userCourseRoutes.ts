// src/routes/userCourseRoutes.ts

import express from 'express';
import { applyForFinancialAid, checkCallLink, createOrder, getAllCourses,getAvailableTimes,getCheckoutCourseDetails,getCourseDetails, getCourseForCertificate, getCourseVideos, getCurrentCourses, scheduleCall, searchCourses, unscheduleCall, verifyPayment } from '../controllers/user/userCourseController'; 
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/user/userWishlistController';
// import { getChatHistory } from '../controllers/user/chatController';
import { getQuizForUser, getQuizResult, submitQuizAnswers } from '../controllers/user/userQuizController';
import { getReviewsForCourse, postFeedbackAndRating } from '../controllers/user/courseReviewController';
import authMiddleware from '../middlewares/jwt';

const router = express.Router();

// router.use(authMiddleware('user'));
// router.use(authMiddleware(['user'])); 

router.get('/courses', getAllCourses);
router.get('/courses/:courseId', getCourseDetails);
router.post('/apply-financial-aid/:courseId', applyForFinancialAid);
router.get('/course-videos/:courseId', getCourseVideos);
router.get('/quiz/:courseId', getQuizForUser);  
router.post('/quiz/:courseId/submit', submitQuizAnswers); 
router.get('/quiz-result/:courseId', getQuizResult);
router.get('/getCourseCertificate/:courseId',getCourseForCertificate);

router.get('/current-courses', getCurrentCourses);
router.get('/checkoutUserCourse/:courseId', getCheckoutCourseDetails);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/available-times/:courseId', getAvailableTimes);
router.post('/schedule-call/:courseId', scheduleCall);
router.post('/unschedule-call/:courseId', unscheduleCall);
router.get('/check-call-link/:userId/:courseId', checkCallLink);
router.post('/wishlist/add', addToWishlist);
router.post('/wishlist/remove', removeFromWishlist);
router.get('/wishlist/:userId', getWishlist);
router.get('/searchCourse', searchCourses);
// router.get('/:userId/:tutorId',getChatHistory);
router.post('/courseFeedback/:courseId',postFeedbackAndRating);
router.get('/courseReviews/:courseId/', getReviewsForCourse);

export default router;