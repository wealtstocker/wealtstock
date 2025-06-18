import React, { useState, useEffect } from 'react';
import { Tabs, Spin, Empty, Card } from 'antd';
import {
  FaWallet, FaPlus, FaArrowUp, FaArrowDown,
  FaHourglassHalf, FaCheckCircle
} from 'react-icons/fa';

import axiosInstance from '../../../api/axiosInstance';


const { TabPane } = Tabs;

const DashboardCard = ({ icon, label, value, color }) => (
  <div className="flex items-center p-4 space-x-4 shadow-md rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-700 text-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-lg font-semibold">{value || 0}</p>
      <p className="capitalize text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  </div>
);

const PaymentHistory = ({ data }) => {
  if (!data || data.length === 0) {
    return <Empty description="No Transactions Found" className="my-6" />;
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <Card key={index} className="p-4 flex justify-between items-center">
          <div>
            <p className="text-lg font-medium">₹{item.amount}</p>
            <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
            <p className="text-xs text-gray-400">{item.method} - {item.utr_number}</p>
          </div>
          <div className={`text-${item.status === 'successful' ? 'green' : 'yellow'}-600 font-semibold`}>
            {item.status}
          </div>
        </Card>
      ))}
    </div>
  );
};

const PaymentPage = () => {
  const [fundRequests, setFundRequests] = useState({ pending: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundRequests = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/wallet/fund-requests');
        setFundRequests({
          pending: res.data.pending || [],
          completed: res.data.completed || [],
        });
      } catch (error) {
        console.error("❌ Error loading fund requests:", error);
      }
      setLoading(false);
    };

    fetchFundRequests();
  }, []);

  const totalAmount = (arr) => arr.reduce((acc, cur) => acc + parseFloat(cur.amount), 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Fund Request Summary</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DashboardCard
            icon={<FaWallet />}
            label="Total Requests"
            value={`₹${totalAmount([...fundRequests.pending, ...fundRequests.completed])}`}
            color="blue"
          />
          <DashboardCard
            icon={<FaHourglassHalf />}
            label="Pending Requests"
            value={`₹${totalAmount(fundRequests.pending)}`}
            color="yellow"
          />
          <DashboardCard
            icon={<FaCheckCircle />}
            label="Approved Requests"
            value={`₹${totalAmount(fundRequests.completed)}`}
            color="green"
          />
        </div>
      )}

      <Tabs defaultActiveKey="pending" type="card">
        <TabPane
          tab={
            <div className="flex items-center space-x-2">
              <FaHourglassHalf />
              <span>Pending</span>
            </div>
          }
          key="pending"
        >
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Spin />
            </div>
          ) : (
            <PaymentHistory data={fundRequests.pending} />
          )}
        </TabPane>
        <TabPane
          tab={
            <div className="flex items-center space-x-2">
              <FaCheckCircle />
              <span>Approved</span>
            </div>
          }
          key="completed"
        >
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Spin />
            </div>
          ) : (
            <PaymentHistory data={fundRequests.completed} />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PaymentPage;
