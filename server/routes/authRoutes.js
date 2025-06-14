import express from 'express';
import AuthController from '../controllers/authController.js';
import passport from 'passport';


const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // Forces account selection
  })
);
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureMessage: true
  }),
  (req, res) => {
    // Successful authentication
    res.redirect(process.env.CLIENT_URL);
  }
);

router.get('/me', AuthController.getCurrentUser);

export default router;