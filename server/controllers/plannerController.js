import StudyPlan from '../models/StudyPlan.js';
import StudyTopic from '../models/StudyTopic.js';
import StudySchedule from '../models/StudySchedule.js';
import FileParser from '../services/fileParser.js';
import NLPService from '../services/nlpService.js';
import SchedulerService from '../services/schedulerService.js';

const PlannerController = {
  async createPlan(req, res) {
  try {
    const { user } = req;
    const { title, deadline, dailyHours, studyDays } = req.body;
    
    let originalContent = '';
    let originalFilename = '';
    
    if (req.file) {
      originalContent = await FileParser.parseFile(req.file);
      originalFilename = req.file.originalname;
    } else if (req.body.content) {
      originalContent = req.body.content;
    } else {
      return res.status(400).json({ message: 'Either file or content is required' });
    }
    
    const plan = await StudyPlan.create({
      userId: user.id,
      title,
      originalFilename,
      originalContent,
      deadline,
      dailyHours,
      studyDays,
    });
    
    const topics = await NLPService.extractTopicsFromText(originalContent);
    
    const savedTopics = [];
    for (const [index, topic] of topics.entries()) {
      const savedTopic = await StudyTopic.create({
        planId: plan.id,
        topicName: topic.topic_name,
        subtopics: JSON.stringify(topic.subtopics),
        estimatedHours: topic.estimated_hours,
        complexity: topic.complexity,
        sequenceOrder: index + 1,
      });
      savedTopics.push(savedTopic);
    }

    const scheduleItems = SchedulerService.generateStudySchedule({
      topics: savedTopics,
      deadline,
      dailyHours: parseFloat(dailyHours),
      studyDays,
    });
    
    for (const item of scheduleItems) {
      await StudySchedule.create({
        planId: plan.id,
        topicId: item.topic_id,
        studyDate: item.study_date,
        durationHours: item.duration_hours,
      });
    }
    
    const fullPlan = {
      ...plan,
      topics: savedTopics,
      schedule: scheduleItems
    };

    res.status(201).json(fullPlan);
  } catch (err) {
    console.error('[ERROR] in createPlan:', err);
    res.status(500).json({ message: 'Failed to create study plan', error: err.message });
  }
},

  async getPlans(req, res) {
    try {
      const { user } = req;
      const plans = await StudyPlan.findByUserId(user.id);

      const plansWithStatus = await Promise.all(plans.map(async (plan) => {
        const scheduleItems = await StudySchedule.findByPlanId(plan.id);
        const isCompleted = scheduleItems.length > 0 && scheduleItems.every(item => item.is_completed);
        return {
          ...plan,
          completed: isCompleted
        };
      }));

      res.json(plansWithStatus);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get study plans', error: err.message });
    }
  },

  async getPlan(req, res) {
    try {
      const { id } = req.params;
      console.log("Fetching full plan for ID:", id);
      const plan = await PlannerController.getFullPlan(id);
      console.log(plan)
      
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      // Check if the plan belongs to the user
      if (plan.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      res.json(plan);
    } catch (err) {
      console.error("Error in getPlan:", err);
      res.status(500).json({ message: 'Failed to get study plan', error: err.message });
    }
  },

  async deletePlan(req, res) {
    try {
      const { id } = req.params;
      const plan = await StudyPlan.findById(id);
      
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      
      if (plan.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      await StudyPlan.delete(id);
      res.json({ message: 'Plan deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete study plan', error: err.message });
    }
  },

  async updateScheduleItem(req, res) {
  try {
    console.log('Updating schedule item:', req.params.id, req.body);
    const { id } = req.params;
    const { isCompleted } = req.body;
    
    if (typeof isCompleted !== 'boolean') {
      return res.status(400).json({ message: 'isCompleted must be a boolean' });
    }

    const scheduleItem = await StudySchedule.findById(id);
    if (!scheduleItem) {
      console.log('Schedule item not found:', id);
      return res.status(404).json({ message: 'Schedule item not found' });
    }
    
    console.log('Found schedule item:', scheduleItem);

    // Verify the plan belongs to the user
    const plan = await StudyPlan.findById(scheduleItem.plan_id);
    if (!plan) {
      console.log('Plan not found for schedule item:', scheduleItem.plan_id);
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    if (plan.user_id !== req.user.id) {
      console.log('Unauthorized access attempt:', req.user.id, 'trying to access plan', plan.id);
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    let updatedItem;
    if (isCompleted) {
      console.log('Marking as completed');
      updatedItem = await StudySchedule.markAsCompleted(id);
    } else {
      console.log('Marking as incomplete');
      updatedItem = await StudySchedule.markAsIncomplete(id);
    }
    
    console.log('Update successful:', updatedItem);
    res.json(updatedItem);
  } catch (err) {
    console.error('Error in updateScheduleItem:', err);
    res.status(500).json({ 
      message: 'Failed to update schedule item', 
      error: err.message,
      stack: err.stack 
    });
  }
},

async getFullPlan(planId) {
  const plan = await StudyPlan.findById(planId);
  console.log(plan);
  if (!plan) return null;
  
  const topics = await StudyTopic.findByPlanId(planId);
  console.log(topics)
  const schedule = await StudySchedule.findByPlanId(planId);
  
  // Calculate total estimated hours
  const totalHours = topics.reduce((sum, topic) => sum + parseFloat(topic.estimated_hours), 0);
  
  return {
    ...plan,
    topics,
    schedule,
    totalHours // Add this to the returned plan object
  };
}
};

export default PlannerController;