import React, { useEffect, useMemo, useState } from 'react';
import { Table, Input, Button, Tag } from 'antd';
import { EyeOutlined, PlusOutlined, FileAddOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllTrades } from '../../../redux/Slices/tradeSlice';

const TradeListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { all, loading } = useSelector((state) => state.trade);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchAllTrades({ navigate }));
  }, [dispatch, navigate]);

  const filteredData = useMemo(() => {
    const trades = Array.isArray(all) ? all : all?.trades || [];
    return trades
      .filter((trade) => trade.status === 'approved')
      .filter((trade) =>
        trade.stock_name?.toLowerCase().includes(searchText.toLowerCase())
      );
  }, [all, searchText]);

  const columns = [
    {
      title: 'Trade No',
      dataIndex: 'trade_number',
      key: 'trade_number',
      sorter: (a, b) => a.trade_number?.localeCompare(b.trade_number),
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
      title: 'Exit Price',
      dataIndex: 'exit_price',
      key: 'exit_price',
    },
    {
      title: 'Exit Qty',
      dataIndex: 'exit_quantity',
      key: 'exit_quantity',
    },
    {
      title: 'Exit Value',
      dataIndex: 'exit_value',
      key: 'exit_value',
    },
    {
      title: 'P/L',
      dataIndex: 'profit_loss_value',
      key: 'profit_loss_value',
      sorter: (a, b) =>
        parseFloat(a.profit_loss_value) - parseFloat(b.profit_loss_value),
      render: (_, record) => (
        <span
          className={
            record.profit_loss === 'profit' ? 'text-green-600' : 'text-red-600'
          }
        >
          ₹{parseFloat(record.profit_loss_value).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Brokerage',
      dataIndex: 'brokerage',
      key: 'brokerage',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => navigate(`/dashboard/trade/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const handleNewTrade = () => navigate('/dashboard/trade/request');
  const handleRequestList = () => navigate('/dashboard/trades/requestlist');

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
        ✅ Completed Trade History
      </h2>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between my-4 gap-4">
        <Input.Search
          placeholder="Search by Stock Name"
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full max-w-sm"
          allowClear
          size="large"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNewTrade}
            className="bg-blue-600"
          >
            New Trade
          </Button>
          <Button icon={<FileAddOutlined />} onClick={handleRequestList}>
            Request Trade
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg bg-white shadow">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1200 }}
          bordered
        />
      </div>

      {/* Note */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Note: This trade data is for informational purposes only. For confirmation, please contact your brokerage agent.
      </p>
    </div>
  );
};

export default TradeListPage;
