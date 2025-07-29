import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingTrades,
  approveTrade,
  deactivateTrade,
} from '../../../redux/Slices/tradeSlice';
import { Table, Button, Input, Space, Tag, Tooltip } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
  FilterOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import gsap from 'gsap';

const TradeRequestListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingTrades, loading } = useSelector((state) => state.trade);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPendingTrades());
  }, [dispatch]);



  const filteredTrades = pendingTrades
    .filter((trade) => trade.status === 'hold')
    .filter((trade) =>
      trade.trade_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.stock_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const columns = [
    {
      title: 'Trade Number',
      dataIndex: 'trade_number',
      key: 'trade_number',
      render: (text) => <span className="font-semibold">{text}</span>,
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: 'Stock Name',
      dataIndex: 'stock_name',
      key: 'stock_name',
      responsive: ['sm', 'md', 'lg'],
    },
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
      key: 'customer_id',
      responsive: ['md', 'lg'],
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      responsive: ['sm', 'md', 'lg'],
    },
    {
      title: 'Entry Value',
      dataIndex: 'entry_value',
      key: 'entry_value',
      responsive: ['md', 'lg'],
    },
    {
      title: 'Exit Value',
      dataIndex: 'exit_value',
      key: 'exit_value',
      responsive: ['md', 'lg'],
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
      responsive: ['lg'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color="blue" className="capitalize">{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          {/* View */}
          <Tooltip title="View Trade">
            <Button
              type="default"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/trades/${record.id}`)}
              className="bg-blue-500 text-white hover:bg-blue-600"
              onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
            />
          </Tooltip>

          {/* Edit / Continue Trade */}
          <Tooltip title="Continue Trade">
            <Button
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/trades/edit/${record.id}`)}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
              onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
            />
          </Tooltip>

          {/* Approve - only if exit_value is > 0 */}
          {record.exit_value && Number(record.exit_value) > 0 && (
            <Tooltip title="Approve Trade">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckCircleOutlined />}
                onClick={() => dispatch(approveTrade(record.id))}
                className="bg-green-500 hover:bg-green-600"
                onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
              />
            </Tooltip>
          )}

          {/* Deactivate */}
          <Tooltip title="Deactivate Trade">
            <Button
              type="default"
              shape="circle"
              icon={<StopOutlined />}
              onClick={() => dispatch(deactivateTrade(record.id))}
              className="bg-red-500 text-white hover:bg-red-600"
              onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Hold Trades</h1>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 w-full md:w-auto">
          <Input.Search
            placeholder="Search by Trade No, Customer ID, or Stock"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm"
            allowClear
            size="large"
          />

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            
            <Button
              icon={<UnorderedListOutlined />}
              onClick={() => navigate('/admin/trades')}
              className="bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto"
              onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
            >
              All trades
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/trades/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
            >
              Add Trade
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredTrades}
          rowKey={(record) => record.id}
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          className="rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default TradeRequestListPage;
