import { addDays, isWeekend, formatISO, parseISO, eachDayOfInterval } from 'date-fns';

const SchedulerService = {
  generateStudySchedule({ topics, deadline, dailyHours, studyDays }) {
    // 1. Convert all inputs to proper numbers
    const parseNumber = (value) => {
      if (typeof value === 'string') {
        // Remove any non-numeric characters except decimal point
        const cleaned = value.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
      }
      return Number(value) || 0;
    };
    // Convert studyDays string to array of numbers
    const availableDays = studyDays.split(',').map(Number).filter(d => !isNaN(d));
    
    // 3. Calculate total hours with proper number conversion
    const totalHours = topics.reduce((sum, topic) => {
      const hours = parseNumber(topic.estimated_hours);
      console.log(`[DEBUG] Adding hours: ${hours} (from ${topic.estimated_hours})`);
      return sum + hours;
    }, 0);

    console.log(`[DEBUG] Total hours: ${totalHours}`);
    
    // FIX: Ensure dailyHours is a number
    dailyHours = parseFloat(dailyHours);
    
    // Calculate available days between now and deadline
    const startDate = new Date();
    const endDate = new Date(deadline);
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Filter only available study days
    const studyDates = allDays.filter(date => {
      const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
      return availableDays.includes(dayOfWeek);
    });
    
    // Calculate total available study hours
    const totalAvailableHours = studyDates.length * dailyHours;
    
    // Adjust estimated hours if needed
    const scaleFactor = totalAvailableHours / totalHours;
    const adjustedTopics = topics.map(topic => ({
      ...topic,
      adjusted_hours: parseFloat(topic.estimated_hours) * scaleFactor,
    }));
    
    // Distribute topics across study dates
    const schedule = [];
    let currentDateIndex = 0;
    let remainingHours = studyDates[currentDateIndex] ? dailyHours : 0;
    
    for (const topic of adjustedTopics) {
      let topicHoursRemaining = topic.adjusted_hours;
      
      while (topicHoursRemaining > 0 && currentDateIndex < studyDates.length) {
        const studyDate = studyDates[currentDateIndex];
        const hoursForThisDay = Math.min(remainingHours, topicHoursRemaining);
        
        schedule.push({
          topic_id: topic.id,
          study_date: formatISO(studyDate, { representation: 'date' }),
          duration_hours: hoursForThisDay,
        });
        
        topicHoursRemaining -= hoursForThisDay;
        remainingHours -= hoursForThisDay;
        
        if (remainingHours <= 0) {
          currentDateIndex++;
          remainingHours = currentDateIndex < studyDates.length ? dailyHours : 0;
        }
      }
    }
  
    
    return schedule;
  },
};

export default SchedulerService;