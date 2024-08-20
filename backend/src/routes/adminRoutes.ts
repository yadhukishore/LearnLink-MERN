import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin/adminAuthController';
import { approveTutor,  getAllCoursesForAdmin, getCourseDetailsForAdmin, getEnrolledStudents, getFinancialAidApplications, getFinancialAidDetails, getPendingTutors, getTutorDetails, getUsers, showTutorsList, toggleTutorBanStatus, toggleUserBlockStatus, updateFinancialAidStatus } from '../controllers/admin/adminController';


const router =express.Router();

router.post('/admin-login',loginAdmin);
router.get('/adminStudentsList',getUsers);
router.put('/toggleUserBlockStatus/:userId', toggleUserBlockStatus);
router.get('/adminApprove-tutor', getPendingTutors);
router.get('/tutor-details/:tutorId',getTutorDetails);
router.post('/approve-tutor/:tutorId',approveTutor);
router.get('/financial-aid-applications', getFinancialAidApplications);
router.get('/financial-aid-details/:applicationId', getFinancialAidDetails);
router.put('/financial-aid-status/:applicationId', updateFinancialAidStatus);
router.get('/adminCoursesList', getAllCoursesForAdmin);
router.get('/adminCourseDetails/:courseId', getCourseDetailsForAdmin);
router.get('/adminEnrolledStudents/:courseId', getEnrolledStudents);
router.get('/adminTutorsList', showTutorsList);
router.put('/toggleTutorBanStatus/:tutorId', toggleTutorBanStatus);

export default router;