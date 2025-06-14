export default function ProgressTracker({ progress }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium mb-2">Progress</h3>
      
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className="bg-blue-600 h-4 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 text-right">
        {progress}% completed
      </p>
    </div>
  );
}