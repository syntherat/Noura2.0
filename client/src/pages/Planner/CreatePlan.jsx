import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Calendar } from 'lucide-react';
import usePlannerStore from '../../stores/plannerStore.js';
import FileUpload from '../../components/planner/FileUpload.jsx';
import SpinnerCreatePlan from '../../components/common/SpinnerCreatePlan.jsx';

// Day mapping for consistent numbering (0=Sunday to 6=Saturday)
const DAY_MAP = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 }
];

export default function CreatePlan() {
  const [title, setTitle] = useState('My Study Plan');
  const [deadline, setDeadline] = useState('');
  const [dailyHours, setDailyHours] = useState(2);
  const [studyDays, setStudyDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dateInputRef = useRef(null);
  
  const handleDateFieldClick = () => {
    dateInputRef.current?.showPicker();
  };

  const { createPlan } = usePlannerStore();
  const navigate = useNavigate();

  const handleStudyDayToggle = (dayValue) => {
    setStudyDays((prev) =>
      prev.includes(dayValue) 
        ? prev.filter((d) => d !== dayValue) 
        : [...prev, dayValue]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !deadline || (!file && !content)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      const planData = {
        title,
        deadline,
        dailyHours: Number(dailyHours),
        // Convert to comma-separated string of day numbers (0-6)
        studyDays: studyDays.join(','),
        ...(file ? { file } : { content }),
      };

      const plan = await createPlan(planData);
      toast.success('Study plan created successfully!');
      navigate(`/app/plans/${plan.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create study plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-violet-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Create Your Study Plan
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Upload your syllabus or course materials to generate a personalized study
          schedule that fits your timeline and preferences.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="font-semibold text-lg">Plan Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your study plan"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="font-semibold text-lg">Course Materials</h3>
            <FileUpload
              onFileChange={({ file, content }) => {
                setFile(file);
                setContent(content);
              }}
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="font-semibold text-lg">Study Preferences</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline Date
              </label>
              <div 
                className="relative cursor-pointer"
                onClick={handleDateFieldClick}
              >
                <input
                  ref={dateInputRef}
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 pl-10 appearance-none cursor-pointer"
                  min={new Date().toISOString().split('T')[0]}
                  // Hide the default calendar icon in browsers that show it
                  style={{ colorScheme: 'light' }}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                {/* This invisible overlay ensures clicks work consistently */}
                <div className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Study Hours
              </label>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full"
              />
              <div className="text-right text-sm text-violet-600 font-medium">
                {dailyHours} hrs
              </div>
              <p className="text-sm text-gray-500 mt-1">
                How many hours per day can you dedicate to studying?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Study Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {DAY_MAP.map((day) => (
                  <button
                    type="button"
                    key={day.value}
                    onClick={() => handleStudyDayToggle(day.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150
                      ${studyDays.includes(day.value)
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Select the days you prefer to study. We recommend at least 3-4 days per week.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <SpinnerCreatePlan className="mr-2" /> Generating Plan...
                </span>
              ) : (
                'Generate Study Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}