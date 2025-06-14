import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import usePlannerStore from '../../stores/plannerStore.js';
import FileUpload from '../../components/planner/FileUpload.jsx';
import SyllabusInput from '../../components/planner/SyllabusInput.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function CreatePlan() {
  const [deadline, setDeadline] = useState('');
  const [dailyHours, setDailyHours] = useState(2);
  const [studyDays, setStudyDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPlan } = usePlannerStore();
  const navigate = useNavigate();

  const handleStudyDayToggle = (day) => {
    setStudyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deadline || (!file && !content)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      const planData = {
        title: 'My Study Plan',
        deadline,
        dailyHours: Number(dailyHours),
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
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                min={new Date().toISOString().split('T')[0]}
              />
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
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleStudyDayToggle(idx)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150
                      ${studyDays.includes(idx)
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {label}
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
                  <Spinner className="mr-2" /> Generating Plan...
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