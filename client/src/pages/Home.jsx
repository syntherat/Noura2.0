import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { CheckCircle, Circle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left Column */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Turn your <br />
            <span className="text-black">syllabus into a</span> <br />
            <span className="text-indigo-600">smart study plan</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Transform overwhelming course materials into personalized, actionable study schedules that adapt to your learning pace and goals.
          </p>
          <div className="mb-8">
            {user ? (
              <Link
                to="/app/plans/create"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
              >
                Create New Plan
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
              >
                Get Started Free
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-10 text-center text-sm font-medium text-gray-800">
            <div>
              <p className="text-xl font-bold">10x</p>
              <p>Faster Planning</p>
            </div>
            <div>
              <p className="text-xl font-bold text-pink-500">AI</p>
              <p>Powered Parsing</p>
            </div>
            <div>
              <p className="text-xl font-bold">100%</p>
              <p>Personalised</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 space-y-6">
          {/* Syllabus Card */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">📘 CS 101 Syllabus</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Introduction to Programming</li>
              <li>Data Structures</li>
              <li>Algorithms</li>
            </ul>
          </div>

          {/* Study Plan Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700 text-sm">Generated Study Plan</h4>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full px-2 py-0.5">Week 1</span>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 w-5 h-5 mt-0.5" />
                <div>
                  <p>Read Chapter 1-2</p>
                  <p className="text-xs text-gray-500">2 hours • Due Monday</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="text-gray-400 w-5 h-5 mt-0.5" />
                <div>
                  <p>Practice Problems 1-10</p>
                  <p className="text-xs text-gray-500">1.5 hours • Due Wednesday</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="text-gray-400 w-5 h-5 mt-0.5" />
                <div>
                  <p>Lab Assignment 1</p>
                  <p className="text-xs text-gray-500">3 hours • Due Friday</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
