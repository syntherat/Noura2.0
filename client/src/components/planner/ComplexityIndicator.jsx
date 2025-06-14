// components/planner/ComplexityIndicator.jsx
export default function ComplexityIndicator({ complexity, completed = false }) {
  const complexityLevel = Math.min(5, Math.max(1, complexity || 3));
  const colors = [
    completed ? 'bg-green-300' : 'bg-green-500',
    completed ? 'bg-blue-300' : 'bg-blue-500', 
    completed ? 'bg-yellow-300' : 'bg-yellow-500',
    completed ? 'bg-orange-300' : 'bg-orange-500',
    completed ? 'bg-red-300' : 'bg-red-500'
  ];

  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${colors[complexityLevel - 1]}`} />
      <span className={`ml-1 text-xs ${completed ? 'text-gray-400' : 'text-gray-500'}`}>
        {complexityLevel}/5
      </span>
    </div>
  );
}