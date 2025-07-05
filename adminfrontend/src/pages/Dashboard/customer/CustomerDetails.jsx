import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Tooltip, Button, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerById } from '../../../redux/Slices/customerSlice';
import { fetchAllTrades } from '../../../redux/Slices/tradeSlice';
import { CopyOutlined } from '@ant-design/icons';
import Toast from '../../../services/toast';

const CustomerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: customer, loading, error } = useSelector((state) => state.customer);
  const { all: trades, loading: trade_loading } = useSelector((state) => state.trade);

  useEffect(() => {
    dispatch(fetchCustomerById(id));
    dispatch(fetchAllTrades());
  }, [dispatch, id]);

  const handleCopy = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    Toast.success(`${label} copied to clipboard`);
  };

  const customerTrades = trades.filter((trade) => trade.customer_id === id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!customer) {
    return <p className="text-center text-gray-500">Customer not found.</p>;
  }

  return (
    <div className="p-2 md:p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <h2 className="text-3xl font-bold text-blue-600 mb-4">👤 Customer Profile</h2>

      <Card
        bordered
        className="shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-gray-800">
          {/* ID Row with Copy */}
          <div className="col-span-1 sm:col-span-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-600">🆔 ID:</span>
            <span className="text-red-600">{customer.id}</span>
            <Tooltip title="Copy ID">
              <Button
                size="small"
                icon={<CopyOutlined />}
                className="ml-1"
                onClick={() => handleCopy(customer.id, 'ID')}
              />
            </Tooltip>
          </div>

          {/* Name */}
          <p><span className="font-semibold text-gray-600">👤 Full Name:</span> {customer.full_name}</p>

          {/* Email */}
          <p><span className="font-semibold text-gray-600">✉️ Email:</span> {customer.email}</p>

          {/* Phone */}
          <p><span className="font-semibold text-gray-600">📞 Phone:</span> {customer.phone_number}</p>

          {/* Gender */}
          <p><span className="font-semibold text-gray-600">⚧️ Gender:</span> {customer.gender}</p>

          {/* DOB */}
          <p><span className="font-semibold text-gray-600">🎂 DOB:</span> {new Date(customer.dob).toLocaleDateString()}</p>

          {/* Account Type */}
          <p><span className="font-semibold text-gray-600">💼 Account Type:</span> {customer.account_type}</p>

          {/* City */}
          <p><span className="font-semibold text-gray-600">🏙️ City:</span> {customer.city}</p>

          {/* State */}
          <p><span className="font-semibold text-gray-600">🌍 State:</span> {customer.state}</p>

          {/* Address */}
          <p className="sm:col-span-2">
            <span className="font-semibold text-gray-600">📫 Address:</span> {customer.address}
          </p>

          {/* Aadhar */}
          <p><span className="font-semibold text-gray-600">🆔 Aadhar No:</span> {customer.aadhar_number}</p>

          {/* PAN */}
          <p><span className="font-semibold text-gray-600">🧾 PAN No:</span> {customer.pan_number}</p>

          {/* Password with Copy */}
          <div className="col-span-1 sm:col-span-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-600">🔐 Password:</span>
            <span className="text-red-600">{customer.password_hash}</span>
            <Tooltip title="Copy Password">
              <Button
                size="small"
                icon={<CopyOutlined />}
                className="ml-1"
                onClick={() => handleCopy(customer.password_hash, 'Password')}
              />
            </Tooltip>
          </div>

          {/* Document Link */}
          {/* {customer.document_url && (
      <p className="sm:col-span-2">
        <span className="font-semibold text-gray-600">📄 Document:</span>{' '}
        <a
          href={`${import.meta.env.VITE_BASE_URL}/${customer.document_url.replace(/\\/g, '/')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700 transition"
        >
          View Document
        </a>
      </p>
    )} */}
        </div>
      </Card>

      {/* Trade List */}
      <div className='py-3'>
        <h3 className="text-2xl font-semibold text-green-600 my-3">📊 Trade History</h3>
        <Card
          bordered
          className="shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <Table
            dataSource={customerTrades}
            loading={trade_loading}
            rowKey="id"
            scroll={{ x: '100%' }}
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: 'Trade No',
                dataIndex: 'trade_number',
              },
              {
                title: 'Stock Name',
                dataIndex: 'instrument',
              },
              {
                title: 'Buy',
                render: (trade) => `${trade.buy_quantity} @ ₹${trade.buy_price}`,
              },
              {
                title: 'Sell',
                render: (trade) => `${trade.exit_quantity} @ ₹${trade.exit_price}`,
              },
              {
                title: 'Buy Value',
                dataIndex: 'buy_value',
              },
              {
                title: 'Sell Value',
                dataIndex: 'exit_value',
              },
              {
                title: 'Profit/Loss',
                render: (trade) => (
                  <Tag color={trade.profit_loss === 'loss' ? 'red' : 'green'}>
                    ₹{trade.profit_loss_value}
                  </Tag>
                ),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (status) => (
                  <Tag color={status === 'approved' ? 'blue' : 'orange'}>{status}</Tag>
                ),
              },
              {
                title: 'Created At',
                dataIndex: 'created_at',
                render: (date) => new Date(date).toLocaleString(),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetails;