import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Button,
  Tag,
  Space,
  Spin,
  Tooltip,
  Empty,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  approveTrade,
  fetchAllTrades,
} from '../../../redux/Slices/tradeSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';

const TradeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { all: trades, loading } = useSelector((state) => state.trade);
  const { all: customers } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(fetchAllTrades());
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveTrade(id));
  };

  const getCustomerName = (id) => {
    const customer = customers.find((c) => c.id === id);
    return customer ? customer.full_name : 'Unknown';
  };

  const columns = [
    {
      title: 'Trade No.',
      dataIndex: 'trade_number',
      key: 'trade_number',
      responsive: ['sm'],
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => (
        <div>
          <div className="font-medium text-indigo-700">
            {getCustomerName(record.customer_id)}
          </div>
          <div className="text-sm text-gray-500">ID: {record.customer_id}</div>
        </div>
      ),
    },
    {
      title: 'Instrument',
      dataIndex: 'instrument',
      key: 'instrument',
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'P/L Value',
      dataIndex: 'profit_loss_value',
      key: 'profit_loss_value',
      render: (value) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          ₹{value}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="View Trade">
            <Button
              type="default"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/trades/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title="Edit Trade">
            <Button
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/trades/edit/${record.id}`)}
            />
          </Tooltip>

          {record.status !== 'approved' && (
            <Tooltip title="Approve Trade">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4 overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl font-bold text-indigo-700">All Trades</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/trades/create')}
        >
          Add Trade
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : trades.length === 0 ? (
        <Empty description="No trades found" />
      ) : (
        <div className="w-full overflow-x-auto">
          <Table
            columns={columns}
            dataSource={trades}
            rowKey="id"
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} trades`,
            }}
            scroll={{ x: 'max-content' }} // ✅ Enables horizontal scroll
            className="min-w-[800px]"     // ✅ Ensures proper min width on mobile
          />
        </div>

      )}
    </div>
  );
};

export default TradeList;
