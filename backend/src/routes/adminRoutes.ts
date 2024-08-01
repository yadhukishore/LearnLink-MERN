import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin/adminAuthController';
import { getUsers } from '../controllers/admin/adminController';


const router =express.Router();

router.post('/admin-login',loginAdmin);
router.get('/adminStudentsList',getUsers);

export default router;