import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Documents</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Flashcards Created</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quizzes Taken</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-gray-500">No recent activity yet. Upload your first document to get started!</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
