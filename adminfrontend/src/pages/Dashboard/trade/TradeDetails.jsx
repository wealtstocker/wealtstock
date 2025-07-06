import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleTrade, approveTrade, deactivateTrade } from '../../../redux/Slices/tradeSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';
import { fetchAllBalances, clearError } from '../../../redux/Slices/walletSlice';
import { Button, Spin, Tag, Alert, Modal, Tooltip } from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import Toast from '../../../services/toast';
import dayjs from 'dayjs';

const TradeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { single: trade, loading: tradeLoading } = useSelector((state) => state.trade);
  const { all: customers, loading: customerLoading } = useSelector((state) => state.customer);
  const { balances, loading: balanceLoading, error: walletError } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchAllCustomers())
      .then(() => dispatch(fetchSingleTrade(id)))
      .then(() => dispatch(fetchAllBalances()));
  }, [dispatch, id]);

  const getCustomerName = (id) => {
    const customer = customers.find((c) => c.id === id);
    return customer ? customer.full_name : 'Unknown';
  };

  const getCustomerBalance = (customerId) => {
    const balanceObj = balances.find((bal) => bal.customer_id === customerId);
    return balanceObj ? parseFloat(balanceObj.balance).toFixed(2) : '0.00';
  };

  const formatDate = (date) => dayjs(date).format('DD MMM YYYY, hh:mm A');

  const handleApproveTrade = async () => {
    try {
      await dispatch(approveTrade(id)).unwrap();
      dispatch(fetchSingleTrade(id));
      dispatch(fetchAllBalances());
      Toast.success('Trade approved successfully');
    } catch (err) {
      Toast.error('Failed to approve trade');
    }
  };

  const handleDeactivateTrade = () => {
    Modal.confirm({
      title: 'Deactivate Trade',
      content: 'Are you sure you want to deactivate this trade?',
      okText: 'Deactivate',
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(deactivateTrade(id)).unwrap();
          dispatch(fetchSingleTrade(id));
          dispatch(fetchAllBalances());
          Toast.success('Trade deactivated successfully');
        } catch (err) {
          Toast.error('Failed to deactivate trade');
        }
      },
    });
  };

  const isProfit = trade?.profit_loss === 'profit';

  if (tradeLoading || customerLoading || balanceLoading) {
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
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 ml-2">
            📄 Trade Detail: {trade.trade_number}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/trades/edit/${trade.id}`)}
          >
            Update Trade
          </Button>
          {trade.status === 'hold' && (
            <Tooltip title="Approve Trade">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApproveTrade}
              >
                Approve
              </Button>
            </Tooltip>
          )}
          {trade.status !== 'deactivated' && (
            <Tooltip title="Deactivate Trade">
              <Button
                type="default"
                danger
                icon={<StopOutlined />}
                onClick={handleDeactivateTrade}
              >
                Deactivate
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      {walletError && (
        <Alert
          message="Error"
          description={walletError}
          type="error"
          showIcon
          closable
          className="mb-6"
          onClose={() => dispatch(clearError())}
        />
      )}

      {/* <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Trade Performance</h3>
        ```chartjs
        {
          "type": "bar",
          "data": {
            "labels": ["Buy Value", "Sell Value", "Profit/Loss"],
            "datasets": [{
              "label": "Trade Metrics",
              "data": [
                ${trade.buy_value || 0},
                ${trade.exit_value || 0},
                ${parseFloat(trade.profit_loss_value || 0)}
              ],
              "backgroundColor": ["#36A2EB", "#FFCE56", "${isProfit ? '#36A2EB' : '#FF6384'}"],
              "borderColor": ["#2E8BC0", "#FFB300", "${isProfit ? '#2E8BC0' : '#D81B60'}"],
              "borderWidth": 1
            }]
          },
          "options": {
            "responsive": true,
            "scales": {
              "y": {
                "beginAtZero": true,
                "title": {
                  "display": true,
                  "text": "Amount (₹)",
                  "color": "#333333"
                }
              }
            },
            "plugins": {
              "legend": {
                "display": false
              },
              "title": {
                "display": true,
                "text": "Trade Financial Overview",
                "color": "#333333"
              }
            }
          }
        }
        ```
      </div> */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <InfoItem
          label="Customer"
          value={
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => navigate(`/admin/customer/${trade.customer_id}`)}
            >
              {getCustomerName(trade.customer_id)} (ID: {trade.customer_id})
            </span>
          }
        />
        <InfoItem label="Instrument" value={trade.instrument} />
        <InfoItem label="Status" value={<StatusTag status={trade.status} />} />
        <InfoItem label="Current Balance" value={`₹${getCustomerBalance(trade.customer_id)}`} />
        <InfoItem label="Created By" value={trade.created_by} />
        <InfoItem label="Trade Date" value={formatDate(trade.created_at)} />
        <InfoItem label="Last Updated" value={formatDate(trade.updated_at)} />
      </div>

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
            { label: 'Exit Price', value: `₹${trade.exit_price || 'N/A'}` },
            { label: 'Exit Quantity', value: trade.exit_quantity || 'N/A' },
            { label: 'Exit Value', value: `₹${trade.exit_value || '0.00'}` },
          ]}
        />
      </div>

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

const InfoItem = ({ label, value }) => (
  <div className="bg-white rounded border p-3 shadow-sm">
    <div className="text-gray-500 font-medium">{label}</div>
    <div className="font-semibold text-gray-800">{value}</div>
  </div>
);

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

const StatusTag = ({ status }) => {
  const color = status === 'approved' ? 'green' : status === 'hold' ? 'blue' : 'red';
  return <Tag color={color}>{status.toUpperCase()}</Tag>;
};

export default TradeDetails;