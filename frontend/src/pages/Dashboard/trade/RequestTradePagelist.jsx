import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTrades } from '../../../redux/Slices/tradeSlice';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, FileAddOutlined } from '@ant-design/icons';

const RequestTradePagelist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { all, loading } = useSelector((state) => state.trade);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchAllTrades());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const trades = Array.isArray(all) ? all : all?.trades || [];
    return trades
      .filter((trade) => trade.status === 'hold')
      .filter((trade) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          trade.trade_number?.toLowerCase().includes(lowerSearch) ||
          trade.stock_name?.toLowerCase().includes(lowerSearch)
        );
      });
  }, [all, searchText]);

  const columns = [
    {
      title: 'Trade No',
      dataIndex: 'trade_number',
      key: 'trade_number',
    },
    {
      title: 'Stock',
      dataIndex: 'stock_name',
      key: 'stock_name',
    },
    {
      title: 'Buy Price',
      dataIndex: 'buy_price',
      key: 'buy_price',
    },
    {
      title: 'Buy Qty',
      dataIndex: 'buy_quantity',
      key: 'buy_quantity',
    },
    {
      title: 'Buy Value',
      dataIndex: 'buy_value',
      key: 'buy_value',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="orange">HOLD</Tag>,
    },
  ];

  const handleNewTrade = () => navigate('/dashboard/trade/request');
  const handleTrades = () => navigate('/dashboard/trades');

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        🕒 Your Pending Trade Requests
      </h2>
      <div className="flex flex-wrap items-center justify-between my-4 gap-2">
        <Input.Search
          placeholder="Search by Trade No or Stock Name"
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4 w-full max-w-sm"
          allowClear
          size="large"
        />
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNewTrade}
            className="bg-blue-600"
          >
            New Trade
          </Button>
          <Button icon={<FileAddOutlined />} onClick={handleTrades}>
            View Trades
          </Button>
        </div>
      </div>
      <p className="mb-4 text-gray-500">
        These are trades you’ve requested. They are waiting for admin approval.
      </p>
      <div className="overflow-auto rounded-lg bg-white shadow">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </div>
      <p className="text-center text-gray-500 text-sm mt-2">
        Note: This trade is only for informational purposes. For confirmation, please contact your brokerage agent.
      </p>
    </div>
  );
};

export default RequestTradePagelist;
