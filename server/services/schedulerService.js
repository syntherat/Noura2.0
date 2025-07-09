import { addDays, isWeekend, formatISO, parseISO, eachDayOfInterval, getDay } from 'date-fns';

const SchedulerService = {
  generateStudySchedule({ topics, deadline, dailyHours, studyDays }) {
    // 1. Convert all inputs to proper numbers and validate
    const parseNumber = (value) => {
      if (typeof value === 'string') {
        const cleaned = value.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
      }
      return Number(value) || 0;
    };

    // 2. Convert studyDays to array of numbers and validate
    const availableDays = Array.isArray(studyDays) 
      ? studyDays.map(Number).filter(d => !isNaN(d) && d >= 0 && d <= 6)
      : typeof studyDays === 'string' 
        ? studyDays.split(',').map(Number).filter(d => !isNaN(d) && d >= 0 && d <= 6)
        : [];

    if (availableDays.length === 0) {
      throw new Error('No valid study days provided');
    }

    // 3. Calculate total hours with proper number conversion
    const totalHours = topics.reduce((sum, topic) => {
      return sum + parseNumber(topic.estimated_hours);
    }, 0);

    if (totalHours <= 0) {
      throw new Error('Total study hours must be greater than 0');
    }

    // 4. Ensure dailyHours is a positive number
    dailyHours = Math.max(parseNumber(dailyHours), 0.5); // Minimum 0.5 hours per day

    // 5. Calculate available study dates
    const startDate = new Date();
    const endDate = new Date(deadline);
    
    if (startDate >= endDate) {
      throw new Error('Deadline must be in the future');
    }

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Filter only available study days (using date-fns getDay for consistency)
    const studyDates = allDays.filter(date => {
      const dayOfWeek = getDay(date); // 0 (Sun) to 6 (Sat)
      return availableDays.includes(dayOfWeek);
    });

    if (studyDates.length === 0) {
      throw new Error('No study days available within the selected period');
    }

    // 6. Calculate total available study hours
    const totalAvailableHours = studyDates.length * dailyHours;
    
    // 7. Adjust estimated hours if needed (scale down only)
    const scaleFactor = Math.min(1, totalAvailableHours / totalHours);
    const adjustedTopics = topics.map(topic => ({
      ...topic,
      adjusted_hours: parseNumber(topic.estimated_hours) * scaleFactor,
    }));

    // 8. Distribute topics across study dates
    const schedule = [];
    let currentDateIndex = 0;
    let remainingHours = dailyHours;
    let currentTopicIndex = 0;
    let topicHoursRemaining = adjustedTopics[currentTopicIndex]?.adjusted_hours || 0;

    while (currentDateIndex < studyDates.length && currentTopicIndex < adjustedTopics.length) {
      const studyDate = studyDates[currentDateIndex];
      const hoursForThisDay = Math.min(remainingHours, topicHoursRemaining);

      if (hoursForThisDay > 0) {
        schedule.push({
          topic_id: adjustedTopics[currentTopicIndex].id,
          topic_name: adjustedTopics[currentTopicIndex].name,
          study_date: formatISO(studyDate, { representation: 'date' }),
          duration_hours: hoursForThisDay,
          complexity: adjustedTopics[currentTopicIndex].complexity || 'medium'
        });

        topicHoursRemaining -= hoursForThisDay;
        remainingHours -= hoursForThisDay;
      }

      // Move to next topic if current one is complete
      if (topicHoursRemaining <= 0) {
        currentTopicIndex++;
        if (currentTopicIndex < adjustedTopics.length) {
          topicHoursRemaining = adjustedTopics[currentTopicIndex].adjusted_hours;
        }
      }

      // Move to next day if current day is full
      if (remainingHours <= 0) {
        currentDateIndex++;
        remainingHours = dailyHours;
      }
    }

    return schedule;
  },
};

export default SchedulerService;