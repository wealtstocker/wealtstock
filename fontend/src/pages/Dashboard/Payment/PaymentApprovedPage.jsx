import React, { useEffect, useState } from 'react';
import {
  Table,
  DatePicker,
  Input,
  Spin,
  Empty,
  Pagination,
} from 'antd';
import {
  MdCheckCircle
} from 'react-icons/md';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const mockData = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  userId: `USR${1000 + i}`,
  amount: Math.floor(Math.random() * 2000 + 100),
  date: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm:ss'),
  type: i % 2 === 0 ? 'deposit' : 'withdrawal',
  status: ['pending', 'approved', 'cancelled', 'failed'][i % 4],
  brokerCharge: Math.floor(Math.random() * 100),
}));

const PaymentApprovedPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setTimeout(() => {
      const approvedData = mockData.filter(item => item.status === 'approved');
      setTransactions(approvedData);
      setFiltered(approvedData);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let result = [...transactions];
    if (search) {
      result = result.filter(item =>
        item.userId.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateRange) {
      const [start, end] = dateRange;
      result = result.filter(item => {
        const date = dayjs(item.date);
        return date.isAfter(start) && date.isBefore(end);
      });
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [search, dateRange, transactions]);

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Amount (₹)',
      dataIndex: 'amount',
      key: 'amount',
      render: amt => <b className="text-green-700">₹{amt}</b>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: t => (
        <span className={`capitalize ${t === 'deposit' ? 'text-blue-600' : 'text-purple-600'}`}>
          {t}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <span className="text-green-600 font-medium flex items-center gap-1">
          <MdCheckCircle /> Approved
        </span>
      ),
    },
    {
      title: 'Broker Charge',
      dataIndex: 'brokerCharge',
      key: 'brokerCharge',
      render: fee => `₹${fee}`,
    },
    {
      title: 'Date/Time',
      dataIndex: 'date',
      key: 'date',
      render: d => <span className="text-gray-500">{dayjs(d).format("YYYY-MM-DD HH:mm")}</span>,
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-green-700 border-b-2 border-green-500 inline-block pb-1">
        ✅ Approved Payments
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input.Search
          placeholder="🔍 Search User ID"
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md shadow-sm focus:ring-2 focus:ring-green-400"
          allowClear
        />
        <RangePicker
          className="w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-400"
          onChange={(dates) => setDateRange(dates)}
        />
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow-sm">
        {loading ? (
          <Spin size="large" />
        ) : filtered.length === 0 ? (
          <Empty description="No approved transactions found" />
        ) : (
          <>
            <Table
              dataSource={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
              columns={columns}
              pagination={false}
              rowKey="id"
              scroll={{ x: 600 }}
              bordered
              rowClassName={(record, index) =>
                `hover:bg-green-50 transition duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`
              }
              className="rounded-lg shadow-sm"
            />

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)} - {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
              </span>
              <Pagination
                current={currentPage}
                total={filtered.length}
                pageSize={pageSize}
                onChange={page => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>

      <div className="text-sm italic text-center text-gray-600 mt-8 bg-gray-50 p-2 rounded-md">
        * Note: This table displays only approved payment transactions.
      </div>
    </div>
  );
};

export default PaymentApprovedPage;
