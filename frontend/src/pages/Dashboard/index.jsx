import React, { useEffect } from 'react';
import { FaWallet, FaChartLine, FaUserTie, FaCoins } from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';
import { CheckCircle2, Globe, BarChart, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovedTrades, fetchWalletBalance, fetchWalletHistory } from '../../redux/Slices/walletSlice';
import { fetchCustomerById } from '../../redux/Slices/customerSlice';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { balance, approvedTrades, walletHistory } = useSelector((state) => state.wallet);
  const { data: customer, loading: customerLoading } = useSelector((state) => state.customer);

  console.log( approvedTrades, balance, walletHistory)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      dispatch(fetchCustomerById(user.id));
    }
    dispatch(fetchApprovedTrades());
    dispatch(fetchWalletBalance());
    dispatch(fetchWalletHistory());
  }, [dispatch]);

  // Loading check
  const isLoading = customerLoading || !walletHistory || balance === null;

  // Calculations
  const creditAmount =
    walletHistory?.filter((tx) => tx.type === 'credit')?.reduce((acc, tx) => acc + Number(tx.amount), 0) || 0;

  const debitAmount =
    walletHistory?.filter((tx) => tx.type === 'debit')?.reduce((acc, tx) => acc + Number(tx.amount), 0) || 0;

  const stats = [
    {
      label: 'Wallet Balance',
      value: balance !== null ? `₹${Number(balance).toLocaleString()}` : 'Loading...',
      icon: <FaWallet className="text-blue-600 text-xl" />,
      border: 'border-blue-500',
    },
    {
      label: 'Total Trades',
      value: approvedTrades || 0,
      icon: <FaChartLine className="text-green-600 text-xl" />,
      border: 'border-green-500',
    },
    {
      label: 'Account Type',
      value: customer?.account_type || 'Loading...',
      icon: <FaUserTie className="text-indigo-600 text-xl" />,
      border: 'border-indigo-500',
    },
    {
      label: 'Total Earnings',
      value: `₹${creditAmount.toLocaleString()}`,
      icon: <FaCoins className="text-yellow-500 text-xl" />,
      border: 'border-yellow-500',
    },
    {
      label: 'Total Spent',
      value: `₹${debitAmount.toLocaleString()}`,
      icon: <FaCoins className="text-red-500 text-xl" />,
      border: 'border-red-500',
    },
  ];

  const quickLinks = [
    { label: 'Markets', icon: <BarChart size={18} />, href: '/dashboard/trade/markets' },
    { label: 'Bank Account', icon: <BsBank size={18} />, href: '/dashboard/bank' },
    { label: 'Payment', icon: <Globe size={18} />, href: '/dashboard/payment' },
    { label: 'Approved', icon: <CheckCircle2 size={18} />, href: '/dashboard/payment-approved' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="loader mb-4 mx-auto"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="md:flex flex-1/2  space-y-2 justify-between items-center mb-6">
        <div>
          <h1 className="md:text-2xl  font-bold text-gray-800">
            👋 Welcome Back, {customer?.full_name || 'Trader'}
          </h1>
          <p className="text-sm text-gray-500">
            Account Type: <span className="font-medium text-gray-700">{customer?.account_type || 'N/A'}</span>
          </p>
        </div>
        <div className="md:flex space-y-1 gap-2">
          <Link to="/dashboard/settings" className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition">
            <Settings size={18} /> Settings
          </Link>
          <Link to="/support" className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition">
            <HelpCircle size={18} /> Help
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-6 gap-2.5 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl md:p-5 p-4 shadow-md hover:shadow-lg transition-all border-l-4 ${item.border}`}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {quickLinks.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              className="bg-white rounded-xl shadow p-5 md:flex flex-col items-center hover:bg-blue-50 transition-all text-center border hover:border-blue-500"
            >
              <div className="mb-2 text-blue-600">{link.icon}</div>
              <span className="text-sm font-medium text-gray-700">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-6 gap-3 mt-10">
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

      {/* Wallet History */}
      <div className="bg-white rounded-xl p-5 shadow mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">📒 Recent Wallet History</h3>
       <div className="overflow-x-auto w-full">
         <table className="min-w-full text-xs sm:text-sm text-left text-gray-500">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Balance</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {walletHistory?.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="border-t hover:bg-gray-50">
                  <td className={`py-2 px-4 font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type}
                  </td>
                  <td className="py-2 px-4">₹{Number(tx.amount).toLocaleString()}</td>
                  <td className="py-2 px-4">₹{Number(tx.balance).toLocaleString()}</td>
                  <td className="py-2 px-4">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;