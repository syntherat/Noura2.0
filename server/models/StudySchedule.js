import pool from '../config/database.js';

const StudySchedule = {
  async create({ planId, topicId, studyDate, durationHours }) {
    const { rows } = await pool.query(
      `INSERT INTO study_schedule 
       (plan_id, topic_id, study_date, duration_hours) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [planId, topicId, studyDate, durationHours]
    );
    return rows[0];
  },

async findByPlanId(planId) {
  const { rows } = await pool.query(
    `SELECT ss.*, st.topic_name, st.complexity
     FROM study_schedule ss
     JOIN study_topics st ON ss.topic_id = st.id
     WHERE ss.plan_id = $1
     ORDER BY ss.study_date, ss.id`,
    [planId]
  );
  return rows;
},
   async findById(id) {
    const { rows } = await pool.query(
      `SELECT ss.*, st.topic_name 
       FROM study_schedule ss
       JOIN study_topics st ON ss.topic_id = st.id
       WHERE ss.id = $1`,
      [id]
    );
    return rows[0];
  },

async markAsCompleted(scheduleId) {
  try {
    console.log('Marking schedule item as completed:', scheduleId);
    const { rows } = await pool.query(
      `UPDATE study_schedule 
       SET is_completed = TRUE, completed_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [scheduleId]
    );
    if (rows.length === 0) {
      throw new Error('No rows updated');
    }
    console.log('Marked as completed:', rows[0]);
    return rows[0];
  } catch (err) {
    console.error('Error in markAsCompleted:', err);
    throw err;
  }
},
async markAsIncomplete(scheduleId) {
  try {
    console.log('Marking schedule item as incomplete:', scheduleId);
    const { rows } = await pool.query(
      `UPDATE study_schedule 
       SET is_completed = FALSE, completed_at = NULL 
       WHERE id = $1 RETURNING *`,
      [scheduleId]
    );
    if (rows.length === 0) {
      throw new Error('No rows updated');
    }
    console.log('Marked as incomplete:', rows[0]);
    return rows[0];
  } catch (err) {
    console.error('Error in markAsIncomplete:', err);
    throw err;
  }
},
};

export default StudySchedule;