import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-600">Dashboard Coming Soon</h1>
        <p className="mt-4 text-lg text-gray-600">
          We're working hard to bring you an amazing dashboard experience.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This section is currently under development. Please check back soon.
        </p>

        {/* Home Button */}
        <Link to="/" className="inline-block mt-6">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition-all duration-200 shadow-md">
            Go to Home
          </button>
        </Link>

        {/* Optional Emoji */}
        <div className="mt-6 animate-bounce text-blue-500 text-3xl">🚧</div>
      </div>
    </div>
  );
};

export default Dashboard;
