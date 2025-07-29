import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Spin, Tooltip, Empty, Input, Select } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  StopOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTrades, approveTrade, deactivateTrade } from '../../../redux/Slices/tradeSlice';
import { fetchAllBalances } from '../../../redux/Slices/walletSlice';

import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';
import Papa from 'papaparse';
import { gsap } from 'gsap';

const TradeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { all: trades, loading } = useSelector((state) => state.trade);
  const { all: customers } = useSelector((state) => state.customer);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchAllTrades());
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const handleApproveTrade = async (id) => {
    try {
      await dispatch(approveTrade(id)).unwrap();
      dispatch(fetchSingleTrade(id));
      dispatch(fetchAllBalances());

    } catch (err) {
      Toast.error('Failed to approve trade');
    }
  };

  const getCustomerName = (id) => customers.find((c) => c.id === id)?.full_name || 'Unknown';

  const filteredTrades = trades.filter((trade) => {
    const customerName = getCustomerName(trade.customer_id)?.toLowerCase();
    const customerId = trade.customer_id?.toLowerCase();
    const tradeNo = trade.trade_number?.toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && trade.status === 'approved') ||
      (filterStatus === 'pending' && trade.status === 'hold') ||
      (filterStatus === 'approved' && trade.status === 'approved');

    return (
      matchesStatus &&
      (customerName?.includes(search) || customerId?.includes(search) || tradeNo?.includes(search))
    );
  });

  const handleExportCSV = () => {
    const csvData = filteredTrades.map((item) => ({
      'Trade No': item.trade_number,
      Customer: getCustomerName(item.customer_id),
      'Customer ID': item.customer_id,
      'Stock Name': item.stock_name,
      Status: item.status,
      'P/L': item.profit_loss,
      'P/L Value': item.profit_loss_value,
      'Buy Price': item.buy_price,
      'Buy Quantity': item.buy_quantity,
      'Exit Price': item.exit_price,
      'Exit Quantity': item.exit_quantity,
      Brokerage: item.brokerage,
      'Created At': item.created_at,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'all_trades.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { title: 'Trade No.', dataIndex: 'trade_number', key: 'trade_number', responsive: ['md'] },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => (
        <div className="font-medium text-indigo-700 cursor-pointer hover:underline" onClick={() => navigate(`/admin/customer/${record.customer_id}`)}>
          {getCustomerName(record.customer_id)}<br /><span className="text-sm text-gray-500">ID: {record.customer_id}</span>
        </div>
      ),
    },
    { title: 'Stock Name', dataIndex: 'stock_name', key: 'stock_name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'hold' ? 'blue' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'P/L Value',
      key: 'profit_loss',
      render: (_, record) => {
        const isProfit = record.profit_loss === 'profit';
        const amount = parseFloat(record.profit_loss_value || 0).toFixed(2);
        const icon = isProfit ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        const color = isProfit ? 'text-green-600' : 'text-red-600';
        return <span className={`flex items-center gap-1 font-semibold ${color}`}>{icon} ₹{amount}</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="View Trade">
            <Button type="default" shape="circle" icon={<EyeOutlined />} onClick={() => navigate(`/admin/trades/${record.id}`)} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300" onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })} onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })} />
          </Tooltip>
          <Tooltip title="Edit Trade">
            <Button type="default" shape="circle" icon={<EditOutlined />} onClick={() => navigate(`/admin/trades/edit/${record.id}`)} className="bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-300" onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })} onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })} />
          </Tooltip>
          {record.status === 'hold' && Number(record.exit_value) > 0 && (
            <Tooltip title="Approved Trade">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApproveTrade(record?.id)}
                className="bg-green-500 hover:bg-green-600 transition-all duration-300"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
              />
            </Tooltip>
          )}
          {record.status === 'hold' && (
            <Tooltip title="Continue Trade">
              <Button type="link" shape="circle" icon={<RightCircleOutlined />} onClick={() => navigate(`/admin/trades/edit/${record.id}`)} className="bg-green-500 hover:bg-green-600 transition-all duration-300" onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })} onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })} />
            </Tooltip>
          )}
          {record.status !== 'deactivated' && (
            <Tooltip title="Deactivate Trade">
              <Button type="default" shape="circle" icon={<StopOutlined />} onClick={() => dispatch(deactivateTrade(record.id))} className="bg-red-500 text-white hover:bg-red-600 transition-all duration-300" onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })} onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];



  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center sm:text-left">📋 All Trades</h2>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex gap-4 w-full sm:w-auto">
          <Input.Search placeholder="Search by Name, ID, or Trade No" allowClear onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-sm mb-4 sm:mb-0" size="large" />
          <Select value={filterStatus} onChange={setFilterStatus} className="w-full sm:w-40 mb-4 sm:mb-0" size="large">
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button icon={<FilterOutlined />} onClick={handleExportCSV} className="bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto" onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })} onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}>Export CSV</Button>
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => navigate('/admin/traderequest')}

            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
          >
            Request Trade
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/trades/create')} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })} onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}>Add Trade</Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-10"><Spin size="large" /></div>
      ) : filteredTrades.length === 0 ? (
        <Empty description="No trades found" className="py-10" />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <Table columns={columns} dataSource={filteredTrades} rowKey="id" bordered pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'], showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} trades` }} scroll={{ x: 'max-content' }} className="min-w-[800px]" />
        </div>
      )}
      <p className="text-center text-xs text-gray-500 mt-4">*Disclaimer: Trade data is for internal use only. Ensure accuracy before approving or deactivating trades. Last updated: 07:14 PM IST, July 21, 2025.</p>
    </div>
  );
};

export default TradeList;