import passport from 'passport';
import User from '../models/User.js';

const AuthController = {
  login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || 'Login failed' });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Session login error:', err);
          return next(err);
        }
        return res.json({ 
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
          }
        });
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
    
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create user
    const user = await User.create({ firstName, lastName, email, password });
    
    // Log in the user
    req.login(user, (err) => {
      if (err) {
        console.error('Login after registration failed:', err);
        return res.status(500).json({ message: 'Registration successful but login failed' });
      }
      return res.status(201).json({ user });
    });
  } catch (err) {
    console.error('Registration error:', err);
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