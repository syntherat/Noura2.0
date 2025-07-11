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
    console.log(`Attempting to deserialize user ID: ${id}`); // Debug log
    
    const { rows } = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1', 
      [id]
    );
    
    if (rows.length === 0) {
      console.warn(`User not found with ID: ${id}`); // Debug log
      // Instead of throwing an error, return null to clear the invalid session
      return done(null, null);
    }
    
    console.log(`Successfully deserialized user:`, rows[0]); // Debug log
    done(null, rows[0]);
  } catch (err) {
    console.error('Deserialization error:', err);
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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user;
    const avatarUrl = profile.photos?.[0]?.value;
    
    // Check by Google ID first
    const googleUser = await pool.query(
      'SELECT * FROM users WHERE google_id = $1', 
      [profile.id]
    );

    if (googleUser.rows.length > 0) {
      user = googleUser.rows[0];
      // Update avatar if it's not set
      if (!user.avatar && avatarUrl) {
        await pool.query(
          'UPDATE users SET avatar = $1 WHERE id = $2',
          [avatarUrl, user.id]
        );
        user.avatar = avatarUrl;
      }
    } else {
      // Check by email (in case user signed up with email first)
      const emailUser = await pool.query(
        'SELECT * FROM users WHERE email = $1', 
        [profile.emails[0].value]
      );

      if (emailUser.rows.length > 0) {
        // Update existing user with Google ID and avatar
        user = await pool.query(
          'UPDATE users SET google_id = $1, avatar = $2, password_hash = COALESCE(password_hash, \'\') WHERE id = $3 RETURNING *',
          [profile.id, avatarUrl, emailUser.rows[0].id]
        ).then(res => res.rows[0]);
      } else {
        // Create new user with Google data
        user = await pool.query(
          `INSERT INTO users 
           (username, email, google_id, first_name, last_name, avatar, password_hash) 
           VALUES ($1, $2, $3, $4, $5, $6, '') RETURNING *`,
          [
            profile.displayName,
            profile.emails[0].value,
            profile.id,
            profile.name?.givenName || '',
            profile.name?.familyName || '',
            avatarUrl
          ]
        ).then(res => res.rows[0]);
      }
    }

    done(null, user);
  } catch (err) {
    console.error('Google auth error:', err);
    done(err);
  }
}));