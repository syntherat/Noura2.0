import { useState } from 'react';
import { formatMonthYear, getCalendarGridDates } from '../../utils/dateUtils.js';

export default function CalendarView({ schedule, onToggleComplete }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getCalendarGridDates(year, month);

  const normalizeDate = (date) => new Date(date).toISOString().split('T')[0];

  const scheduleByDate = schedule.reduce((acc, item) => {
    const normalized = normalizeDate(item.study_date);
    if (!acc[normalized]) acc[normalized] = [];
    acc[normalized].push(item);
    return acc;
  }, {});

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const complexityClass = (level) => {
    return level === 'easy'
      ? 'bg-green-100 text-green-700'
      : level === 'medium'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';
  };

  const truncate = (str, len) => (str.length > len ? str.slice(0, len) + '…' : str);

  return (
    <div className="rounded-2xl bg-white shadow-md border border-gray-200 p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevMonth} className="text-xl px-2">&#x2039;</button>
        <h2 className="text-xl font-semibold text-center">{formatMonthYear(currentDate)}</h2>
        <button onClick={goToNextMonth} className="text-xl px-2">&#x203A;</button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center font-semibold text-sm text-gray-500">
            {d}
          </div>
        ))}

        {days.map(({ date, isCurrentMonth }, index) => {
          const dateStr = normalizeDate(date);
          const items = scheduleByDate[dateStr] || [];
          const borderColor = items.length === 0
            ? 'border-gray-300'
            : items.every(i => i.is_completed)
              ? 'border-green-500'
              : items.some(i => i.is_completed)
                ? 'border-yellow-500'
                : 'border-red-500';

          return (
            <div
              key={index}
              className={`border p-1 h-28 overflow-hidden text-xs rounded ${borderColor} ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}`}
            >
              <div className="text-right text-[10px] font-semibold">{date.getDate()}</div>

              <div className="space-y-0.5 mt-1 overflow-y-auto max-h-20 scrollbar-hide pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleComplete(item.id, !item.is_completed)}
                    className="relative cursor-pointer bg-gray-100 hover:bg-gray-200 px-1.5 py-1 rounded text-left group space-y-0.5"
                    title={`${item.topic_name} — ${item.duration_hours ? `${item.duration_hours}` : ''}h — ${item.complexity}`}
                  >
                    {/* Tag + Hours */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-medium px-1 py-0.5 rounded-full ${complexityClass(item.complexity)}`}
                      >
                        {item.complexity}
                      </span>
                      <span className="text-[10px] text-gray-500 font-semibold">
                        {item.duration_hours}h
                      </span>
                    </div>

                    {/* Title */}
                    <div
                      className={`text-[11px] leading-tight ${
                        item.is_completed ? 'line-through text-green-700' : 'text-gray-800'
                      }`}
                    >
                      {truncate(item.topic_name, 22)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
