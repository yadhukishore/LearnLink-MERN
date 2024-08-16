// routes/tutor.routes.ts
import express from 'express';
import multer from 'multer';
import { tutorLogin, tutorRegister, tutorSubmitingProofs } from '../controllers/tutor/tutorAuthController';
import { approveTutor } from '../controllers/admin/adminController';
import { createCourse, getCourseById, getCourses } from '../controllers/tutor/coursesController';


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

export default router;