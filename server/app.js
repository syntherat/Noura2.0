import express from 'express';
import session from 'express-session';
import passport from 'passport';
import pgSession from 'connect-pg-simple';
import cors from 'cors';
import morgan from 'morgan';
import pool from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';
import errorHandler from './utils/errorHandler.js';
import './config/passport.js';

const app = express();

// First, initialize the PgSession constructor
const PgSession = pgSession(session);

// Then create the session store
const sessionStore = new PgSession({
  pool: pool,
  tableName: 'session',
  createTableIfMissing: true
});

sessionStore.on('connect', () => {
  console.log('Session store connected');
});

sessionStore.on('error', (error) => {
  console.error('Session store error:', error);
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true);
app.enable('trust proxy');

// Session setup
app.use(
  session({
    store: sessionStore, // Use the already created store
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/planner', plannerRoutes);

// Error handling
app.use(errorHandler);

export default app;