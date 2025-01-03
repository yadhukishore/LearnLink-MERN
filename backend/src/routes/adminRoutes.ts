import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin/adminAuthController';
import { addCategory, adminRemovePost, approveTutor,  deleteCategory,  getAdminFeeds,  getAllCategories,  getAllCoursesForAdmin, getCourseDetailsForAdmin, getEnrolledStudents, getFinancialAidApplications, getFinancialAidDetails, getPendingTutors, getReportedCourses, getTutorDetails, getUsers, showTutorsList, toggleTutorBanStatus, toggleUserBlockStatus, updateCategory, updateFinancialAidStatus } from '../controllers/admin/adminController';
import { getCoursesCountByCategory, getStudentEnrollmentsByDate, getTutorLoginData, getUserLoginData } from '../controllers/admin/adminDashboardController';
import authMiddleware from '../middlewares/jwt';
import adminAuthMiddleware from '../middlewares/adminAuth';
import { addEvent, deleteEvent, getEvents, renderLatestUpdates, renderSpecialOffers, updateEvent } from '../controllers/admin/adminEventController';
import multer from 'multer';


const router =express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/admin-login',loginAdmin);

// router.use(authMiddleware('admin'));
// router.use(adminAuthMiddleware); 

router.get('/adminStudentsList',authMiddleware(['admin']),getUsers);
router.put('/toggleUserBlockStatus/:userId' ,authMiddleware(['admin']),toggleUserBlockStatus);
router.get('/adminApprove-tutor',authMiddleware(['admin']),getPendingTutors);
router.get('/tutor-details/:tutorId',authMiddleware(['admin']),getTutorDetails);
router.post('/approve-tutor/:tutorId',approveTutor);
router.get('/financial-aid-applications',authMiddleware(['admin']), getFinancialAidApplications);
router.get('/financial-aid-details/:applicationId', getFinancialAidDetails);
router.put('/financial-aid-status/:applicationId', updateFinancialAidStatus);
router.get('/adminCoursesList',authMiddleware(['admin']), getAllCoursesForAdmin);
router.get('/adminCourseDetails/:courseId',authMiddleware(['admin']), getCourseDetailsForAdmin);
router.get('/adminEnrolledStudents/:courseId', getEnrolledStudents);
router.get('/adminTutorsList', showTutorsList);
router.put('/toggleTutorBanStatus/:tutorId', toggleTutorBanStatus);
router.get('/adminFeedControl',getAdminFeeds);
router.post('/AdminRemoveFeed/:feedId',adminRemovePost);
router.get('/adminCoursesCategory',getAllCategories);
router.post('/adminCoursesCategory',addCategory);
router.put('/adminEditCoursesCategory/:id', updateCategory);
router.delete('/adminCoursesCategory/:id', deleteCategory);
router.get('/user-login-data', getUserLoginData);
router.get('/tutor-login-data', getTutorLoginData);
router.get('/courses-count-by-category', getCoursesCountByCategory);
router.get('/student-enrollments', getStudentEnrollmentsByDate);
router.get('/adminReportedCourses',getReportedCourses);
router.post('/events', upload.single('image'), addEvent);
router.put('/events/:id', upload.single('image'), updateEvent); 
router.get('/events', getEvents);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/special-offers', renderSpecialOffers);
router.get('/latest_update',renderLatestUpdates);

export default router;