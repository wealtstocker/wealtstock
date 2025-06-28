import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleTrade } from '../../../redux/Slices/tradeSlice';
import dayjs from 'dayjs';
import { Button, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';

const TradeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { single: trade, loading } = useSelector((state) => state.trade);

  useEffect(() => {
    dispatch(fetchSingleTrade(id));
  }, [dispatch, id]);

  const formatDate = (date) => dayjs(date).format('DD MMM YYYY, hh:mm A');
  const isProfit = trade?.profit_loss === 'profit';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="text-center text-gray-500 py-10">
        🚫 No trade found.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 ml-2">
            📄 Trade Detail: {trade.trade_number}
          </h2>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/admin/trades/edit/${trade.id}`)}
        >
          Update Trade
        </Button>
      </div>

      {/* Summary Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <InfoItem label="Customer ID" value={trade.customer_id} />
        <InfoItem label="Instrument" value={trade.instrument} />
        <InfoItem label="Status" value={<StatusTag status={trade.status} />} />
        <InfoItem label="Created By" value={trade.created_by} />
        <InfoItem label="Trade Date" value={formatDate(trade.created_at)} />
        <InfoItem label="Last Updated" value={formatDate(trade.updated_at)} />
      </div>

      {/* Buy/Sell Details */}
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <InfoCard
          title="Buy Details"
          items={[
            { label: 'Buy Price', value: `₹${trade.buy_price}` },
            { label: 'Buy Quantity', value: trade.buy_quantity },
            { label: 'Buy Value', value: `₹${trade.buy_value}` },
          ]}
        />

        <InfoCard
          title="Sell Details"
          items={[
            { label: 'Exit Price', value: `₹${trade.exit_price}` },
            { label: 'Exit Quantity', value: trade.exit_quantity },
            { label: 'Exit Value', value: `₹${trade.exit_value}` },
          ]}
        />
      </div>

      {/* P/L and Brokerage */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div
          className={`text-lg font-bold px-4 py-3 rounded-lg ${
            isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          Profit/Loss: ₹{parseFloat(trade.profit_loss_value).toFixed(2)} ({trade.profit_loss})
        </div>
        <InfoItem label="Brokerage" value={`₹${trade.brokerage}`} />
      </div>
    </div>
  );
};

// ✅ Info Box
const InfoItem = ({ label, value }) => (
  <div className="bg-white rounded border p-3 shadow-sm">
    <div className="text-gray-500 font-medium">{label}</div>
    <div className="font-semibold text-gray-800">{value}</div>
  </div>
);

// ✅ Info Card Group
const InfoCard = ({ title, items }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border">
    <h4 className="text-md font-semibold mb-2 text-blue-600">{title}</h4>
    <ul className="space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="text-sm text-gray-700">
          <span className="text-gray-600">{item.label}: </span>
          <strong>{item.value}</strong>
        </li>
      ))}
    </ul>
  </div>
);

// ✅ Status Tag with AntD color
const StatusTag = ({ status }) => {
  const color = status === 'approved' ? 'green' : status === 'requested' ? 'orange' : 'blue';
  return <Tag color={color}>{status}</Tag>;
};

export default TradeDetails;
