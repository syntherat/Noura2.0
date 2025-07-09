import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils.js';
import usePlannerStore from '../../stores/plannerStore.js';
import Spinner from '../../components/common/Spinner.jsx';

export default function ViewPlans() {
  const { plans, fetchPlans, loading, error } = usePlannerStore();
  
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center h-64">
        <Spinner className="text-blue-600 h-8 w-8" />
      </div>
    );
  }

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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow px-4 py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Study Plans</h2>
            <Link
              to="/app/plans/create"
              className="btn-primary"
            >
              Create New Plan
            </Link>
          </div>

          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-10 rounded-xl shadow-inner border border-dashed border-gray-300">
              <svg
                className="w-16 h-16 text-indigo-400 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700">No Study Plans Yet</h3>
              <p className="text-gray-500 mt-1 text-center max-w-xs">
                Start by creating a study plan to organize your goals and track your progress.
              </p>
              <Link
                to="/app/plans/create"
                className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Plan
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Link
                  key={plan.id}
                  to={`/app/plans/${plan.id}`}
                  className="group relative block bg-white border border-gray-200 rounded-2xl shadow-md p-5 transition transform hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Completed badge */}
                  {plan.completed && (
                    <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Completed
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {plan.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(plan.deadline)}</span>
                  </div>

                  <div className="mt-3 flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-4 h-4 mr-1 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                      />
                    </svg>
                    {plan.daily_hours} hours/day
                  </div>

                  <div className="mt-1 flex items-center text-gray-600 text-sm">
                    <svg
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 4a1 1 0 011-1h3a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM16 5a1 1 0 011 1v12a1 1 0 01-1 1h-3a1 1 0 01-1-1V6a1 1 0 011-1h3z"
                      />
                    </svg>
                    {plan.study_days.split(',').length} days/week
                  </div>

                  <div className="mt-4 flex justify-end">
                    <span className="text-indigo-500 text-sm font-medium group-hover:underline">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}