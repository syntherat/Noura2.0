import { formatDate, daysBetween } from '../../utils/dateUtils.js';
import TasksCounter from './TasksCounter.jsx';

export default function PlanSummary({ plan }) {
  const totalTopics = plan.topics.length;
  const totalHours = plan.topics.reduce((sum, topic) => sum + topic.estimated_hours, 0);
  const daysRemaining = daysBetween(new Date(), new Date(plan.deadline));

  const completedItems = plan.schedule.filter(item => item.is_completed).length;
  const totalItems = plan.schedule.length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const avgComplexity = totalTopics > 0
    ? plan.topics.reduce((sum, topic) => sum + (topic.complexity || 3), 0) / totalTopics
    : 0;

  const complexityLabel = avgComplexity <= 2
    ? 'Easy'
    : avgComplexity <= 4
    ? 'Medium'
    : 'Hard';

  const complexityColor =
    avgComplexity <= 2
      ? 'text-green-600'
      : avgComplexity <= 4
      ? 'text-yellow-600'
      : 'text-red-600';

  const complexityDotColor =
    avgComplexity <= 2
      ? 'bg-green-500'
      : avgComplexity <= 4
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div className="bg-white p-4 rounded-lg">
      {/* Keep existing progress component */}
      <TasksCounter
        completed={completedItems}
        total={totalItems}
        totalHours={Number(plan?.total_hours || 0).toFixed(0)}
      />

      {/* Styled quick stats UI below */}
      <div className="space-y-2 shadow-md border rounded-md border-gray-200 px-5 py-3 mt-4">
        <h3 className="text-sm text-gray-800 mb-3 font-bold">Plan Stats</h3>
        <Stat label="Plan title" value={plan.title} />
        <Stat label="Deadline" value={formatDate(plan.deadline)} />
        <Stat label="Total topics" value={totalTopics} />
        <Stat label="Days remaining" value={daysRemaining} />

        {/* Aesthetic average complexity */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Average complexity</p>
          <div className="flex items-center gap-2">
            <div className={`text-sm font-medium ${complexityColor}`}>
              {complexityLabel} ({avgComplexity.toFixed(1)}/5)
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-full ${
                    level <= Math.round(avgComplexity) ? complexityDotColor : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
