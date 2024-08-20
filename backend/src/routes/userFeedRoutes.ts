import express from 'express';
import { createFeed, getFeeds, reportFeed } from '../controllers/user/feedsController';
import multer from 'multer';

const router = express.Router();

// Set up multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

router.get('/feeds', getFeeds);
router.post('/feeds', upload.array('files', 10), createFeed); 
router.post('/feedReport/:feedId/', reportFeed);
export default router;