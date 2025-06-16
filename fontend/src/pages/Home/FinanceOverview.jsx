import React from "react";
import { FaWindowRestore, FaHome } from "react-icons/fa";

const FinanceOverview = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* CARD 1: Secure Retirement */}
      <div className="bg-purple-100 rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Secure Retirement</h2>
          <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full">
            <FaWindowRestore className="text-white text-lg sm:text-xl" />
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mt-2">
          Want to feel more confident about your financial future? Our range of annuity strategies can help.
        </p>

        {/* Chart Block */}
        <div className="mt-4 bg-white rounded-xl p-4 sm:p-6 shadow-inner">
          <h3 className="text-xs sm:text-sm text-gray-600">ASSET GENERATED</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-1">128,7K</p>
          <div className="mt-1 flex items-center justify-between text-xs sm:text-sm text-gray-500">
            <span>29 July 00:00</span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">+3.4%</span>
          </div>
          <div className="mt-3 h-20 bg-gradient-to-t from-purple-200 to-purple-400 rounded-lg"></div>
        </div>
      </div>

      {/* CARD 2: Invest with Potential */}
      <div className="bg-purple-100 rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Invest with Potential</h2>
          <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full">
            <FaHome className="text-white text-lg sm:text-xl" />
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mt-2">
          FlexGuard includes a Performance Lock feature which gives clients the flexibility and control to secure their future.
        </p>

        {/* Chart Block */}
        <div className="mt-4 bg-white rounded-xl p-4 sm:p-6 shadow-inner">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm text-gray-600">OPPORTUNITIES</h3>
            <span className="text-xs text-gray-500">Last 7 Days</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold mt-1">6,4K</p>
          <span className="bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded mt-1 inline-block">+3.4%</span>

          <div className="grid grid-cols-2 gap-4 mt-4 text-xs sm:text-sm text-gray-700">
            <div>
              <p className="font-medium">ASSET RECEIVED</p>
              <p>1,1K <span className="text-green-600 text-xs ml-1">+3.4%</span></p>
            </div>
            <div>
              <p className="font-medium">SPENDING</p>
              <p>2,3K <span className="text-green-600 text-xs ml-1">+11.4%</span></p>
            </div>
          </div>

          <div className="mt-3 h-2 bg-gradient-to-r from-purple-300 via-yellow-300 to-blue-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;
