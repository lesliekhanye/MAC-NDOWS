import express from 'express';
import { createFolder } from '../controllers/folderController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/folders', ensureAuthenticated, createFolder);

export default router;
