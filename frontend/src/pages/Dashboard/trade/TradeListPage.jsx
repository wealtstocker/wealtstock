import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllTrades } from '../../../redux/Slices/tradeSlice';

const TradeListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { all, loading } = useSelector((state) => state.trade);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchAllTrades());
  }, [dispatch]);

  const filteredData = all?.filter((trade) =>
    trade.trade_number?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Trade No',
      dataIndex: 'trade_number',
      key: 'trade_number',
      sorter: (a, b) => a.trade_number.localeCompare(b.trade_number),
    },
    // {
    //   title: 'Instrument',
    //   dataIndex: 'instrument',
    //   key: 'instrument',
    // },
    {
      title: 'Buy Price',
      dataIndex: 'buy_price',
      key: 'buy_price',
      sorter: (a, b) => parseFloat(a.buy_price) - parseFloat(b.buy_price),
    },
    {
      title: 'Buy Qty',
      dataIndex: 'buy_quantity',
      key: 'buy_quantity',
      sorter: (a, b) => a.buy_quantity - b.buy_quantity,
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
        <span className={record.profit_loss === 'profit' ? 'text-green-600' : 'text-red-600'}>
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
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => navigate(`/dashboard/trade/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">📊 Trade List</h2>

      <Input.Search
        placeholder="Search by Trade No"
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 max-w-sm"
        allowClear
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default TradeListPage;
