import pool from '../config/database.js';

const StudyTopic = {
  async create({ planId, topicName, subtopics, estimatedHours, complexity, sequenceOrder }) {
    const { rows } = await pool.query(
      `INSERT INTO study_topics 
       (plan_id, topic_name, subtopics, estimated_hours, complexity, sequence_order) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [planId, topicName, subtopics, estimatedHours, complexity, sequenceOrder]
    );
    return rows[0];
  },

  async findByPlanId(planId) {
    const { rows } = await pool.query(
      'SELECT * FROM study_topics WHERE plan_id = $1 ORDER BY sequence_order',
      [planId]
    );
    return rows;
  },
};

export default StudyTopic;