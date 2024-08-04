import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin/adminAuthController';
import { approveTutor, getPendingTutors, getTutorDetails, getUsers } from '../controllers/admin/adminController';


const router =express.Router();

router.post('/admin-login',loginAdmin);
router.get('/adminStudentsList',getUsers);
router.get('/adminApprove-tutor', getPendingTutors);
router.get('/tutor-details/:tutorId',getTutorDetails);
router.post('/approve-tutor/:tutorId',approveTutor);
export default router;