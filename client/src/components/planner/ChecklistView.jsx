import { format } from 'date-fns';
import ComplexityIndicator from './ComplexityIndicator';
import { useState } from 'react';
import Spinner from '../common/Spinner.jsx';

export default function ChecklistView({ schedule, onToggleComplete, isUpdating }) {
  const [optimisticUpdates, setOptimisticUpdates] = useState({});
  const formatDate = (d) => format(new Date(d), 'dd MMM yyyy');

  const handleOptimisticToggle = async (itemId, isCompleted) => {
    const originalItem = schedule.find(i => i.id === itemId);
    setOptimisticUpdates(prev => ({
      ...prev,
      [itemId]: { ...originalItem, is_completed: isCompleted }
    }));
    
    try {
      await onToggleComplete(itemId, isCompleted);
    } catch (error) {
      setOptimisticUpdates(prev => {
        const newState = {...prev};
        delete newState[itemId];
        return newState;
      });
    }
  };

  return (
    <div className="space-y-3 relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex justify-center items-center rounded-lg">
          <Spinner className="text-blue-600 h-8 w-8" />
        </div>
      )}

      {schedule.map((item) => {
        const displayItem = optimisticUpdates[item.id] || item;
        const topicName = displayItem.topic_name || 'Untitled Topic';
        const topicCategory = displayItem.topic_category || 'General';
        const isDone = displayItem.is_completed;

        return (
          <div
            key={item.id}
            className={`flex items-start justify-between p-4 rounded-xl border shadow-sm transition-all duration-200 ${
              isDone ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
            } ${isUpdating ? 'opacity-80' : ''}`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => !isUpdating && handleOptimisticToggle(item.id, !isDone)}
                className={`h-5 w-5 mt-1 border-gray-400 rounded cursor-pointer transition-colors duration-200 ${
                  isUpdating ? 'cursor-not-allowed' : ''
                }`}
                disabled={isUpdating}
              />

              <div>
                <div className="flex items-center gap-2">
                  <p
                    className={`text-base font-medium transition-colors duration-200 ${
                      isDone ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {topicName}
                  </p>
                  <ComplexityIndicator
                    complexity={displayItem.complexity}
                    completed={isDone}
                  />
                </div>

                <p
                  className={`text-sm mt-0.5 transition-colors duration-200 ${
                    isDone ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {formatDate(displayItem.study_date)} • {displayItem.duration_hours} hour
                  {displayItem.duration_hours !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-400 font-medium whitespace-nowrap mt-1">
              {topicCategory}
            </div>
          </div>
        );
      })}
    </div>
  );
}