import pool from '../config/database.js';
import bcrypt from 'bcrypt';

const User = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, username, email, first_name, last_name FROM users WHERE id = $1', 
      [id]
    );
    return rows[0];
  },

// In your User model file
async create({ firstName, lastName, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const username = `${firstName} ${lastName}`;
  
  const { rows } = await pool.query(
    `INSERT INTO users 
     (username, first_name, last_name, email, password_hash) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, first_name, last_name, avatar`,
    [username, firstName, lastName, email, hashedPassword]
  );
  return rows[0];
},

  async createGoogleUser(profile) {
    const { rows } = await pool.query(
      `INSERT INTO users 
       (username, email, google_id, first_name, last_name) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, first_name, last_name`,
      [
        profile.displayName,
        profile.emails[0].value,
        profile.id,
        profile.name?.givenName || '',
        profile.name?.familyName || ''
      ]
    );
    return rows[0];
  }
};

export default User;