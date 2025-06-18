import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Tag, Space, Spin, Tooltip } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { approveTrade, fetchAllTrades } from '../../../redux/Slices/tradeSlice';

const TradeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { all: trades, loading } = useSelector((state) => state.trade);

  useEffect(() => {
    dispatch(fetchAllTrades());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveTrade(id));
  };

  const columns = [
    {
      title: 'Trade Number',
      dataIndex: 'trade_number',
      key: 'trade_number',
    },
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
      key: 'customer_id',
    },
    {
      title: 'Instrument',
      dataIndex: 'instrument',
      key: 'instrument',
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
        <Space>
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Trades</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/trades/create')}
        >
          Add Trade
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={trades}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} trades`,
          }}
        />
      )}
    </div>
  );
};

export default TradeList;
