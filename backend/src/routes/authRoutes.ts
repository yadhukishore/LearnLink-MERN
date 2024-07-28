import express from 'express';
import { register, login, verifyEmail, forgotPassword, verifyForgotPasswordOTP, resetPassword, googleAuth } from '../controllers/authController';
import { validateRegister } from '../middlewares/validation';

const router = express.Router();

router.post('/register',validateRegister, register);
router.post('/verify-otp',verifyEmail);
router.post('/login', login);
router.post('/forgot-password',forgotPassword);
router.post('/verify-otp-password',verifyForgotPasswordOTP);
router.post('/reset-password',resetPassword);
router.post('/googleAuth',googleAuth);

export default router;