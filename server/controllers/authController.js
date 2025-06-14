import passport from 'passport';
import User from '../models/User.js';

const AuthController = {
  login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });
      
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json({ user });
      });
    })(req, res, next);
  },

  logout(req, res) {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: 'Logout failed' });
      res.json({ message: 'Logged out successfully' });
    });
  },

async register(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (await User.findByEmail(email)) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const user = await User.create({ firstName, lastName, email, password });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Registration failed' });
      res.status(201).json({ user });
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
},

  googleAuth: (req, res, next) => {
  console.log("Initiating Google OAuth");
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
},

  googleAuthCallback: passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),

    getCurrentUser(req, res) {
        if (req.isAuthenticated()) {
            return res.json({ 
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email
            } 
        });
        }
        res.status(401).json({ message: 'Not authenticated' });
    }
};

export default AuthController;