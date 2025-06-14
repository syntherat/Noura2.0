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
      <div className="flex justify-center items-center h-64">
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
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <p className="text-gray-600">You don't have any study plans yet.</p>
          <Link
            to="/app/plans/create"
            className="inline-block mt-4 btn-primary"
          >
            Create Your First Plan
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              to={`/app/plans/${plan.id}`}
              className="block bg-white p-4 rounded-lg shadow-sm border hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{plan.title}</h3>
                <span className="text-sm text-gray-500">{formatDate(plan.deadline)}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {plan.daily_hours} hours/day • {plan.study_days.split(',').length} days/week
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}