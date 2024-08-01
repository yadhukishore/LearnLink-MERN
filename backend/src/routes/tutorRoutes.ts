import express from 'express';
import { tutorRegister, tutorSubmitingProofs } from '../controllers/tutor/tutorAuthController';


const router =express.Router();
router.post('/tutorRegister',tutorRegister);
router.post('/submit-tutor-proofs/:tutorId',tutorSubmitingProofs);
export default router;