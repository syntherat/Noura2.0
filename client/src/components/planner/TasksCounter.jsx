export default function TasksCounter({ completed, total, totalHours }) {
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center space-y-6">
      {/* 1. Circular Progress */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            {/* Background Circle */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="3"
            />
            {/* Progress Circle */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#ef4444" // red-500
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{percentage}%</span>
            <span className="text-xs text-gray-500">Complete</span>
          </div>
        </div>
      </div>

      {/* 2. Tasks Completed Horizontal Bar */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
          <span>Tasks Completed</span>
          <span>{completed} / {total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-red-500 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 3. Stats: Completed / Remaining / Total Time */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded-md">
          <p className="text-2xl font-bold text-green-600">{completed}</p>
          <p className="text-gray-600">Completed</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-md">
          <p className="text-2xl font-bold text-yellow-600">{remaining}</p>
          <p className="text-gray-600">Remaining</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-2xl font-bold text-blue-600">{totalHours}h</p>
          <p className="text-gray-600">Total Time</p>
        </div>
      </div>
    </div>
  );
}
