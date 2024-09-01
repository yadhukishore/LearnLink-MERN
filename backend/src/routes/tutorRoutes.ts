// routes/tutor.routes.ts
import express from 'express';
import multer from 'multer';
import { tutorLogin, tutorRegister, tutorSubmitingProofs } from '../controllers/tutor/tutorAuthController';
import { approveTutor } from '../controllers/admin/adminController';
import { addCourseVideo, createCourse, getAllCategoriesForTutor, getCourseById, getCourses, updateCourse, updateCourseVideo } from '../controllers/tutor/coursesController';
import { createAvailableTime, deleteAvailableTime, getAllAvailableTimes, getNonExpiredAvailableTimes, getTutorProfile, takeTheCourses, updateTutorProfile } from '../controllers/tutor/tutorPersonal';
import { authenticateTutor } from '../middlewares/tutorAuth';
import { getFinancialAidApplicationsForTutor, getFinancialAidDetailsForTutor, updateFinancialAidStatusForTutor } from '../controllers/tutor/tuttorFinacialAid';
import { getBookedUserDetails, sendCallLink } from '../controllers/user/userCourseController';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/tutorRegister', tutorRegister);
console.log("Registering submit-tutor-proofs route");
router.post('/submit-tutor-proofs/:tutorId', tutorSubmitingProofs);
router.post('/approve-tutor/:tutorId', approveTutor);
router.post('/tutorLogin', tutorLogin);
router.post('/tutorCreateCourse', upload.fields([
  { name: 'thumbnailFile', maxCount: 1 },
  { name: 'videos', maxCount: 10 }, 
]), createCourse);
router.get('/getCourses/:tutorId', getCourses);
router.get('/tutorCourseDetail/:courseId', getCourseById);
router.patch('/updateCourse/:id', updateCourse);
router.patch('/updateCourseVideo/:id/:videoId', updateCourseVideo);
router.post('/addCourseVideo/:id', upload.single('video'), addCourseVideo);
router.get('/tutorProfile', authenticateTutor, getTutorProfile);
router.patch('/updateProfile', authenticateTutor, updateTutorProfile);
router.get('/getAllCategoriesForTutor', getAllCategoriesForTutor);
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

export default router;