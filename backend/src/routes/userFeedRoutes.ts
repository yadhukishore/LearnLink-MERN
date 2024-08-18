import express from 'express';
import { createFeed, getFeeds } from '../controllers/user/feedsController';
import multer from 'multer';

const router = express.Router();

// Set up multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

router.get('/feeds', getFeeds);
router.post('/feeds', upload.array('files', 10), createFeed); // Upload multiple files, max 10

export default router;