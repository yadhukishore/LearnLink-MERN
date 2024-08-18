import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin/adminAuthController';
import { approveTutor, getFinancialAidApplications, getFinancialAidDetails, getPendingTutors, getTutorDetails, getUsers, updateFinancialAidStatus } from '../controllers/admin/adminController';


const router =express.Router();

router.post('/admin-login',loginAdmin);
router.get('/adminStudentsList',getUsers);
router.get('/adminApprove-tutor', getPendingTutors);
router.get('/tutor-details/:tutorId',getTutorDetails);
router.post('/approve-tutor/:tutorId',approveTutor);
router.get('/financial-aid-applications', getFinancialAidApplications);
router.get('/financial-aid-details/:applicationId', getFinancialAidDetails);
router.put('/financial-aid-status/:applicationId', updateFinancialAidStatus);

export default router;