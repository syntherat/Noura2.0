import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-violet-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <Link
            to="/app/plans/create"
            className="bg-violet-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-violet-700 transition-all"
          >
            Create New Plan
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Welcome to Smart Study Planner
          </h3>
          <p className="text-gray-600">
            Get started by creating a new study plan from your syllabus. Upload a PDF, DOCX, or paste the content directly,
            and we'll generate a personalized study schedule based on your available time and deadline.
          </p>
        </div>
      </div>
    </div>
  );
}
