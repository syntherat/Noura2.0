import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils.js';
import usePlannerStore from '../../stores/plannerStore.js';
import PlanSummary from '../../components/planner/PlanSummary.jsx';
import CalendarView from '../../components/planner/CalendarView.jsx';
import ChecklistView from '../../components/planner/ChecklistView.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function PlanDetail() {
  const { id } = useParams();
  const { currentPlan, getPlan, updateScheduleItem, loading, error } = usePlannerStore();
  const [viewMode, setViewMode] = useState('calendar');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        await getPlan(id);
      } catch (err) {
        console.error("Failed to fetch plan:", err);
      }
    };
    fetchPlan();
  }, [id, getPlan]);

  const handleToggleComplete = async (scheduleId, isCompleted) => {
    try {
      setIsUpdating(true);
      await updateScheduleItem(scheduleId, isCompleted);
    } catch (err) {
      console.error("Failed to update item:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left Section (2/3) */}
        <div className="flex flex-col space-y-6 bg-white rounded-xl shadow-md p-4">
          {/* Header */}
          <div className="flex justify-between items-center px-5">
            <h2 className="text-2xl font-bold">
              {currentPlan?.title || 'Loading...'}
            </h2>
            <Link
              to="/app/plans"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Plans
            </Link>
          </div>

          {/* Content */}
          <div className="p-5 pt-0 rounded-xl bg-white min-h-[500px]">
            {loading && !currentPlan ? (
              <div className="flex justify-center items-center h-full">
                <Spinner className="text-blue-600 h-8 w-8" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Study Schedule</h3>
                  <div className="inline-flex rounded-full p-1 space-x-2">
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all
                        ${viewMode === 'calendar' ? 'bg-[#240070] text-white shadow-sm' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
                    >
                      Calendar
                    </button>
                    <button
                      onClick={() => setViewMode('checklist')}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all
                        ${viewMode === 'checklist' ? 'bg-[#240070] text-white shadow-sm' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
                    >
                      List
                    </button>
                  </div>
                </div>

                {viewMode === 'calendar' ? (
                  <CalendarView
                    schedule={currentPlan?.schedule || []}
                    onToggleComplete={handleToggleComplete}
                    isUpdating={isUpdating}
                  />
                ) : currentPlan?.schedule?.length > 0 ? (
                  <ChecklistView
                    schedule={currentPlan.schedule}
                    onToggleComplete={handleToggleComplete}
                    isUpdating={isUpdating}
                  />
                ) : (
                  <p className="text-gray-500 text-sm">No tasks found in schedule.</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Section (1/3) */}
        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-5 h-fit self-start">
          {currentPlan ? (
            <PlanSummary plan={currentPlan} />
          ) : (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}