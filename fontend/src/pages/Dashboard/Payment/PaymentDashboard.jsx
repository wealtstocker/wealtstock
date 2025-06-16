import React, { useState, useEffect } from 'react';
import { Tabs, Spin, Empty } from 'antd';
import { FaWallet, FaArrowDown, FaArrowUp, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExclamationTriangle } from 'react-icons/fa';
import { MdOutlineAddCircle, MdOutlineAttachMoney } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from 'axios';

const DashboardCard = ({ icon, value, label, color }) => (
  <div className="flex items-center p-4 space-x-4 shadow-md rounded-lg bg-gray-50 hover:bg-gray-100">
    <div className={`text-${color} text-3xl`}>{icon}</div>
    <div className="flex flex-col">
      <p className="text-2xl font-semibold">{value || "0"}</p>
      <p className="capitalize text-gray-700">{label}</p>
    </div>
  </div>
);

const statusIcons = {
  pending: <FaHourglassHalf className="text-yellow-500" />,
  approved: <FaCheckCircle className="text-green-500" />,
  cancelled: <FaTimesCircle className="text-red-500" />,
  failed: <FaExclamationTriangle className="text-orange-500" />,
};

const PaymentHistoryTab = ({ status, data }) => {
  const filtered = data.filter(item => item.status === status);
  if (!filtered.length) return <Empty description={`No ${status} requests`} />;

  return (
    <div className="space-y-4">
      {filtered.map((item, idx) => (
        <div key={idx} className="p-4 shadow rounded bg-white flex justify-between items-center">
          <div>
            <p className="font-semibold">{item.type === 'withdrawal' ? 'Withdrawal' : 'Deposit'} - ${item.amount}</p>
            <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
          </div>
          <div className="text-xl">{statusIcons[item.status]}</div>
        </div>
      ))}
    </div>
  );
};

const PaymentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    balance: 0,
    total_deposit: 0,
    total_withdrawal: 0,
    winning_amount: 0,
    loss_amount: 0,
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/wallet-dashboard');
        setWalletData(response.data.wallet);
        setHistory(response.data.history);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#1d1b31] mb-4">My Wallet</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-[#1d1b31]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <DashboardCard icon={<FaWallet />} value={10} label="Wallet Balance" color="indigo-600" />
            <DashboardCard icon={<MdOutlineAddCircle />} value={4} label="Total Deposit" color="green-600" />
            <DashboardCard icon={<FaArrowUp />} value={300} label="Total Withdrawals" color="red-600" />
            <DashboardCard icon={<MdOutlineAttachMoney />} value={999} label="Winnings" color="blue-600" />
            <DashboardCard icon={<FaArrowDown />} value={909} label="Losses" color="yellow-600" />
          </div>

          <Tabs
            defaultActiveKey="pending"
            items={[
              {
                key: 'pending',
                label: 'Pending',
                // children: <PaymentHistoryTab status="pending" data={history} />,
              },
              {
                key: 'approved',
                label: 'Approved',
                // children: <PaymentHistoryTab status="approved" data={history} />,
              },
              {
                key: 'cancelled',
                label: 'Cancelled',
                // children: <PaymentHistoryTab status="cancelled" data={history} />,
              },
              {
                key: 'failed',
                label: 'Failed',
                // children: <PaymentHistoryTab status="failed" data={history} />,
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default PaymentDashboard;
