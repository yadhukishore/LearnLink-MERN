// routes/tutor.routes.ts
import express from 'express';
import multer from 'multer';
import { tutorLogin, tutorRegister, tutorSubmitingProofs } from '../controllers/tutor/tutorAuthController';
import { approveTutor } from '../controllers/admin/adminController';
import { addCourseVideo, createCourse, createQuiz, getAllCategoriesForTutor, getCourseById, getCourses, getQuiz, updateCourse, updateCourseVideo, updateQuiz } from '../controllers/tutor/coursesController';
import { createAvailableTime, deleteAvailableTime, getAllAvailableTimes, getNonExpiredAvailableTimes, getTrendingCourses, getTutorProfile, getTutorWalletDetails, takeTheCourses, updateTutorProfile } from '../controllers/tutor/tutorPersonal';
import { authenticateTutor } from '../middlewares/tutorAuth';
import { getFinancialAidApplicationsForTutor, getFinancialAidDetailsForTutor, updateFinancialAidStatusForTutor } from '../controllers/tutor/tuttorFinacialAid';
import { getBookedUserDetails, sendCallLink } from '../controllers/user/userCourseController';
import authMiddleware from '../middlewares/jwt';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/tutorRegister', tutorRegister);
console.log("Registering submit-tutor-proofs route");
router.post('/submit-tutor-proofs/:tutorId', tutorSubmitingProofs);
router.post('/approve-tutor/:tutorId', approveTutor);
router.post('/tutorLogin', tutorLogin);

// router.use(authMiddleware('tutor'));

router.post('/tutorCreateCourse', upload.fields([
  { name: 'thumbnailFile', maxCount: 1 },
  { name: 'videos', maxCount: 10 }, 
]), createCourse);
router.get('/getCourses/:tutorId', authMiddleware(['tutor']),getCourses);
router.get('/tutorCourseDetail/:courseId',authMiddleware(['tutor']), getCourseById);
router.patch('/updateCourse/:id', updateCourse);
router.patch('/updateCourseVideo/:id/:videoId', updateCourseVideo);
router.post('/addCourseVideo/:id', upload.single('video'), addCourseVideo);
router.get('/tutorProfile', getTutorProfile);
router.patch('/updateProfile', updateTutorProfile);
router.get('/getAllCategoriesForTutor' ,getAllCategoriesForTutor);
router.get('/tutorFinacial-aids',getFinancialAidApplicationsForTutor);
router.get('/FinacialapplyDetail/:applicationId',getFinancialAidDetailsForTutor);
router.put('/financial-aid-status/:applicationId',updateFinancialAidStatusForTutor);
router.post('/create-available-time', createAvailableTime);
router.get('/available-times/:tutorId/:courseId', getAllAvailableTimes);
router.delete('/delete-available-time/:timeId', deleteAvailableTime);
router.get('/takeTheCourses/:tutorId', takeTheCourses); 
router.get('/non-expired-available-times/:tutorId', getNonExpiredAvailableTimes);
router.get('/booked-user-details/:timeId', getBookedUserDetails);
router.post('/send-call-link', sendCallLink);
router.get('/tutorWallet',getTutorWalletDetails);
// router.get('/chat-users/:tutorId',TutorChats );
// router.get('/chat-history/:tutorId/:userId', getChatHistoryTutor);
router.post('/createQuiz/:courseId', authenticateTutor, createQuiz);
router.get('/getQuiz/:courseId', authenticateTutor, getQuiz);
router.put('/updateQuiz/:courseId', authenticateTutor, updateQuiz);
router.get('/trending-courses', getTrendingCourses);

export default router;