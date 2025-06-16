import React from 'react';
import { FaWallet, FaChartLine, FaUserTie, FaCoins } from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';
import { CheckCircle2, Globe, BarChart, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const stats = [
    {
      label: 'Wallet Balance',
      value: '₹12,500.00',
      icon: <FaWallet className="text-blue-600 text-xl" />,
      border: 'border-blue-500'
    },
    {
      label: 'Open Positions',
      value: '4',
      icon: <FaChartLine className="text-green-600 text-xl" />,
      border: 'border-green-500'
    },
    {
      label: 'Account Type',
      value: 'Trading + Demat',
      icon: <FaUserTie className="text-indigo-600 text-xl" />,
      border: 'border-indigo-500'
    },
    {
      label: 'Total Earnings',
      value: '₹6,820.00',
      icon: <FaCoins className="text-yellow-500 text-xl" />,
      border: 'border-yellow-500'
    },
  ];

  const quickLinks = [
    { label: 'Markets', icon: <BarChart size={18} />, href: '/dashboard/trade/markets' },
    { label: 'Bank Account', icon: <BsBank size={18} />, href: '/dashboard/bank' },
    { label: 'Payment', icon: <Globe size={18} />, href: '/dashboard/payment' },
    { label: 'Approved', icon: <CheckCircle2 size={18} />, href: '/dashboard/payment-approved' },
  ];

  return (
    <div className="p-4 py-3 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">👋 Welcome Back, Trader</h1>
        <div className="flex gap-3">
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            <Settings size={18} /> Settings
          </Link>
          <Link
            to="/support"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition"
          >
            <HelpCircle size={18} /> Help
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border-l-4 ${item.border}`}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-semibold text-gray-700">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">🚀 Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              className="bg-white rounded-xl shadow p-5 flex flex-col items-center hover:bg-blue-50 transition-all text-center border hover:border-blue-500"
            >
              <div className="mb-2 text-blue-600">{link.icon}</div>
              <span className="text-sm font-medium text-gray-700">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Additional Info or Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📈 Market Trends</h3>
          <p className="text-gray-500 text-sm">Coming soon: Live charts, stock prices, and performance insights.</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🔐 Security Tips</h3>
          <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
            <li>Enable 2FA from Settings</li>
            <li>Never share your credentials</li>
            <li>Use a strong password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
