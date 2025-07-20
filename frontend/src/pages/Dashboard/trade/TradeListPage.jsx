import React, { useEffect, useMemo, useState } from 'react';
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
    dispatch(fetchAllTrades({ navigate }));
  }, [dispatch, navigate]);

  const filteredData = useMemo(() => {
    const trades = Array.isArray(all) ? all : all?.trades || [];
    return trades.filter((trade) =>
      trade.trade_number?.toLowerCase().includes(searchText.toLowerCase())
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
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        📊 Trade List
      </h2>
<Button
  type="primary"
  className="mb-4"
  onClick={() => navigate('/dashboard/trade/request')}
>
  Place New Trade
</Button>
      <Input.Search
        placeholder="Search by Trade No"
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 w-full max-w-sm"
        allowClear
        size="large"
      />

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
    </div>
  );
};

export default TradeListPage;
