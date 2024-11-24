// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import userRoutes from './src/routes/userRoutes.js';  // Import the routes

const app = express();
const PORT = 3000;

// Resolve __dirname when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup - ORDER IS IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src','views'));

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Session setup
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));

app.use(flash());

// Flash middleware
app.use((req, res, next) => {
    // Get messages from flash
    const error = req.flash('error')[0];
    const message = req.flash('message')[0];
    
    // Only set one type of message
    res.locals.error = error || null;
    res.locals.message = !error ? message : null; // Only show success if there's no error
    res.locals.user = req.session.user || null;
    next();
  });

// Mount all routes
app.use('/', userRoutes);

// Remove duplicate routes that are already in userRoutes
// These should be removed if they're in your userRoutes:
// app.get('/login', (req, res) => {...});
// app.get('/register', (req, res) => {...});
// app.get('/launch', (req, res) => {...});
// app.get('/desktop', ensureAuthenticated, (req, res) => {...});
// app.get('/logout', (req, res) => {...});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});