// routes/userRoutes.js
import express from 'express';
import { register, login, logout } from '../controllers/userController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('loginPage'));
router.get('/register', (req, res) => res.render('registerPage'));
router.get('/launch', (req, res) => res.render('launchPage'));

// Auth routes
router.post('/login', login);  // Handle login POST request
router.post('/register', register);
router.get('/logout', logout);

// Protected routes
router.get('/desktop', ensureAuthenticated, (req, res) => {
    res.render('desktopPage', { user: req.session.user });
});

export default router;