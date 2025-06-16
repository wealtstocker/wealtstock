import React, { useState, useEffect } from 'react';
import { Tabs, Spin, Empty } from 'antd';
import { FaWallet, FaPlus, FaArrowDown, FaArrowUp, FaTimesCircle, FaCheckCircle, FaHourglassHalf, FaBug } from 'react-icons/fa';
import { Card } from "@/components/ui/card";
import axiosInstance from '@/utils/axiosInstance';

const { TabPane } = Tabs;

const DashboardCard = ({ icon, label, value, color }) => (
    <div className="flex items-center p-4 space-x-4 shadow-md rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-700 text-xl`}>{icon}</div>
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
                        <p className="text-lg font-medium">{item.type}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <div className={`text-${item.statusColor}-600 font-semibold`}>{item.status}</div>
                </Card>
            ))}
        </div>
    );
};

const PaymentPage = () => {
    const [walletData, setWalletData] = useState({});
    const [loading, setLoading] = useState(true);
    const [paymentRequests, setPaymentRequests] = useState({});

    useEffect(() => {
        // Simulated fetch for example
        const fetchData = async () => {
            setLoading(true);
            try {
                const walletRes = await axiosInstance.get('/api/wallet/summary');
                const requestsRes = await axiosInstance.get('/api/payment/requests');
                setWalletData(walletRes.data);
                setPaymentRequests(requestsRes.data);
            } catch (err) {
                console.error('Error fetching wallet data:', err);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const statusMap = {
        pending: {
            title: 'Pending',
            icon: <FaHourglassHalf />,
            color: 'yellow'
        },
        approved: {
            title: 'Approved',
            icon: <FaCheckCircle />,
            color: 'green'
        },
        cancelled: {
            title: 'Cancelled',
            icon: <FaTimesCircle />,
            color: 'red'
        },
        failed: {
            title: 'Failed',
            icon: <FaBug />,
            color: 'gray'
        },
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">My Wallet</h1>

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <DashboardCard icon={<FaWallet />} label="Wallet Balance" value={`₹${walletData.balance || 0}`} color="blue" />
                    <DashboardCard icon={<FaPlus />} label="Add Funds" value={`₹${walletData.funds_added || 0}`} color="green" />
                    <DashboardCard icon={<FaArrowUp />} label="Winnings" value={`₹${walletData.winning_amount || 0}`} color="purple" />
                    <DashboardCard icon={<FaArrowDown />} label="Withdrawals" value={`₹${walletData.withdrawn || 0}`} color="red" />
                </div>
            )}

            <Tabs defaultActiveKey="pending" type="card">
                {Object.keys(statusMap).map((key) => (
                    <TabPane
                        tab={<div className="flex items-center space-x-2">
                            {statusMap[key].icon}
                            <span>{statusMap[key].title}</span>
                        </div>}
                        key={key}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[200px]">
                                <Spin />
                            </div>
                        ) : (
                            <PaymentHistory data={paymentRequests[key]} />
                        )}
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default PaymentPage;
