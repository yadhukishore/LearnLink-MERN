import express from 'express';
import { createFeed, DeleteFeed, getFeeds, reportFeed } from '../controllers/user/feedsController';
import multer from 'multer';
import { getUserProfile, updateUserProfile } from '../controllers/user/userProfileController';

const router = express.Router();

// Set up multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

router.get('/feeds', getFeeds);
router.post('/feeds', upload.array('files', 10), createFeed); 
router.post('/feedReport/:feedId/', reportFeed);
router.post('/userFeedDelete/:feedId/', DeleteFeed);
router.get('/userProfile/:userId', getUserProfile);
router.patch('/updateProfile/:userId', updateUserProfile);

export default router;