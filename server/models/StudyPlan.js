import pool from '../config/database.js';

const StudyPlan = {
  async create({ userId, title, originalFilename, originalContent, deadline, dailyHours, studyDays }) {
    const { rows } = await pool.query(
      `INSERT INTO study_plans 
       (user_id, title, original_filename, original_content, deadline, daily_hours, study_days) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, title, originalFilename, originalContent, deadline, dailyHours, studyDays]
    );
    return rows[0];
  },

  async findByUserId(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM study_plans WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM study_plans WHERE id = $1', [id]);
    return rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM study_plans WHERE id = $1', [id]);
  },
};

export default StudyPlan;