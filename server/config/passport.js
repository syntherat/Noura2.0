import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './database.js';
import bcrypt from 'bcrypt';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (rows.length === 0) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
// config/passport.js
passport.use(new GoogleStrategy({
  // ... existing config
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists with this Google ID
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE google_id = $1', 
      [profile.id]
    );

    if (rows.length > 0) return done(null, rows[0]); 

    // Create new user if doesn't exist
    const newUser = {
      google_id: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      first_name: profile.name?.givenName || '',
      last_name: profile.name?.familyName || '',
      password_hash: '' // No password for Google users
    };

    const { rows: [user] } = await pool.query(
      `INSERT INTO users 
       (username, email, password_hash, google_id, first_name, last_name) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        newUser.username, 
        newUser.email, 
        newUser.password_hash, 
        newUser.google_id,
        newUser.first_name,
        newUser.last_name
      ]
    );

    done(null, user);
  } catch (err) {
    done(err);
  }
}));