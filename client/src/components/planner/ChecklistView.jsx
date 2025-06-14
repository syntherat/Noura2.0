import { format } from 'date-fns';
import ComplexityIndicator from './ComplexityIndicator';

export default function ChecklistView({ schedule, onToggleComplete }) {
  const formatDate = (d) => format(new Date(d), 'dd MMM yyyy');

  return (
    <div className="space-y-3">
      {schedule.map((item) => {
        const topicName = item.topic_name || 'Untitled Topic';
        const topicCategory = item.topic_category || 'General';
        const isDone = item.is_completed;

        return (
          <div
            key={item.id}
            className={`flex items-start justify-between p-4 rounded-xl border shadow-sm
              ${isDone ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}
          >
            {/* Checkbox + Topic Info */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => onToggleComplete(item.id, !item.is_completed)}
                className="h-5 w-5 mt-1 border-gray-400 rounded cursor-pointer"
              />

              <div>
                <div className="flex items-center gap-2">
                  <p
                    className={`text-base font-medium ${
                      isDone ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {topicName}
                  </p>
                  <ComplexityIndicator
                    complexity={item.complexity}
                    completed={isDone}
                  />
                </div>

                <p
                  className={`text-sm mt-0.5 ${
                    isDone ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {formatDate(item.study_date)} • {item.duration_hours} hour
                  {item.duration_hours !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Optional: Topic Category */}
            <div className="text-sm text-gray-400 font-medium whitespace-nowrap mt-1">
              {topicCategory}
            </div>
          </div>
        );
      })}
    </div>
  );
}
