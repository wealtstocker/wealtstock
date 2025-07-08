import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCustomerById,
  deactivateCustomer,
  activateCustomer,
  deleteCustomerPermanently,
} from '../../../redux/Slices/customerSlice';
import {
  fetchAllTrades,
  approveTrade,
  deactivateTrade,
} from '../../../redux/Slices/tradeSlice';
import {
  fetchAllBalances,
  updateWalletBalance,
  fetchAllTransactions,
  fetchAllFundRequests,
  fetchAllWithdrawals,
  approveFundRequest,
  rejectFundRequest,
  updateWithdrawalStatus,
  clearError,
} from '../../../redux/Slices/walletSlice';
import {
  Card,
  Spin,
  Button,
  Table,
  Tag,
  Tabs,
  InputNumber,
  Select,
  Modal,
  Alert,
  Tooltip,
  Image,
} from 'antd';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import Toast from '../../../services/toast';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const CustomerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: customer,
    loading: customerLoading,
    error: customerError,
  } = useSelector((state) => state.customer);
  const {
    all: trades,
    loading: tradeLoading,
  } = useSelector((state) => state.trade);
  const {
    balances,
    transactions,
    fundRequests,
    withdrawals,
    loadingBalances,
    loadingTransactions,
    loadingFundRequests,
    loadingWithdrawals,
    error: walletError,
  } = useSelector((state) => state.wallet);

  const [topUpData, setTopUpData] = useState({ amount: '', type: 'credit', description: '' });
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveData, setApproveData] = useState({ requestId: '', amount: '' });

  useEffect(() => {
    dispatch(fetchCustomerById(id));
    dispatch(fetchAllTrades());
    dispatch(fetchAllBalances());
    dispatch(fetchAllTransactions());
    dispatch(fetchAllFundRequests());
    dispatch(fetchAllWithdrawals());
  }, [dispatch, id]);

  const handleCopy = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    Toast.success(`${label} copied to clipboard`);
  };

  const getCustomerBalance = (customerId) => {
    const balanceObj = balances.find((bal) => bal.customer_id === customerId);
    return balanceObj ? parseFloat(balanceObj.balance).toFixed(2) : '0.00';
  };

  const handleTopUp = async () => {
    if (!topUpData.amount || topUpData.amount <= 0) {
      Toast.error('Please enter a valid amount');
      return;
    }
    try {
      await dispatch(
        updateWalletBalance({
          customerId: id,
          amount: topUpData.amount,
          type: topUpData.type,
          description: topUpData.description || `Manual ${topUpData.type} by admin`,
        })
      ).unwrap();
      setShowTopUpModal(false);
      setTopUpData({ amount: '', type: 'credit', description: '' });
    } catch (err) {
      // Error handled by thunk
    }
  };

  const handleApproveFundRequest = async () => {
    if (!approveData.requestId || !approveData.amount || approveData.amount <= 0) {
      Toast.error('Please enter a valid amount');
      return;
    }
    try {
      await dispatch(
        approveFundRequest({ requestId: approveData.requestId, amount: approveData.amount })
      ).unwrap();
      setShowApproveModal(false);
      setApproveData({ requestId: '', amount: '' });
      dispatch(fetchAllBalances());
      Toast.success('Fund request approved successfully');
    } catch (err) {
      // Error handled by thunk
    }
  };

  const handleRejectFundRequest = async (requestId) => {
    try {
      await dispatch(rejectFundRequest(requestId)).unwrap();
      dispatch(fetchAllFundRequests());
      Toast.success('Fund request rejected successfully');
    } catch (err) {
      // Error handled by thunk
    }
  };

  const handleWithdrawalAction = async (withdrawalId, action) => {
    try {
      await dispatch(updateWithdrawalStatus({ withdrawal_id: withdrawalId, action })).unwrap();
      dispatch(fetchAllBalances());
    } catch (err) {
      // Error handled by thunk
    }
  };

  const handleDeactivateCustomer = () => {
    Modal.confirm({
      title: 'Deactivate Customer',
      content: 'Are you sure you want to deactivate this customer?',
      okText: 'Deactivate',
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(deactivateCustomer(id)).unwrap();
          navigate('/admin/customers');
        } catch (err) {
          Toast.error('Failed to deactivate customer');
        }
      },
    });
  };

  const handleActivateCustomer = () => {
    Modal.confirm({
      title: 'Activate Customer',
      content: 'Are you sure you want to activate this customer?',
      okText: 'Activate',
      okType: 'primary',
      onOk: async () => {
        try {
          await dispatch(activateCustomer(id)).unwrap();
        } catch (err) {
          Toast.error('Failed to activate customer');
        }
      },
    });
  };

  const handleDeleteCustomer = () => {
    Modal.confirm({
      title: 'Permanently Delete Customer',
      content: 'This action cannot be undone. Are you sure?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(deleteCustomerPermanently(id)).unwrap();
          navigate('/admin/customers');
        } catch (err) {
          Toast.error('Failed to delete customer');
        }
      },
    });
  };

  const handleApproveTrade = async (tradeId) => {
    try {
      await dispatch(approveTrade(tradeId)).unwrap();
      dispatch(fetchAllTrades());
      dispatch(fetchAllBalances());
    } catch (err) {
      Toast.error('Failed to approve trade');
    }
  };

  const handleDeactivateTrade = async (tradeId) => {
    Modal.confirm({
      title: 'Deactivate Trade',
      content: 'Are you sure you want to deactivate this trade?',
      okText: 'Deactivate',
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(deactivateTrade(tradeId)).unwrap();
          dispatch(fetchAllTrades());
          dispatch(fetchAllBalances());
        } catch (err) {
          Toast.error('Failed to deactivate trade');
        }
      },
    });
  };

  const customerTrades = trades.filter((trade) => trade.customer_id === id && trade.is_active);
  const customerTransactions = transactions.filter((tx) => tx.customer_id === id);
  const customerFundRequests = fundRequests.filter((fr) => fr.customer_id === id);
  const customerWithdrawals = withdrawals.filter((wd) => wd.customer_id === id);

  if (customerLoading || loadingBalances || tradeLoading || loadingTransactions || loadingFundRequests || loadingWithdrawals) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (customerError || walletError) {
    return (
      <div className="text-center text-red-500 py-10">
        <Alert
          message="Error"
          description={customerError || walletError}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearError())}
        />
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">Customer not found.</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-end  gap-3">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>

      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">
          👤 {customer.full_name}'s Profile
          <span className="ml-2 text-sm text-gray-500">
            ({customerFundRequests.filter(fr => fr.status === 'pending').length} pending fund requests, {customerWithdrawals.filter(wd => wd.status === 'requested').length} pending withdrawals)
          </span>
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            type="primary"
            icon={<DollarOutlined />}
            onClick={() => setShowTopUpModal(true)}
          >
            Top-Up/Debit Wallet
          </Button>
          {customer.is_active ? (
            <Button
              type="default"
              danger
              icon={<StopOutlined />}
              onClick={handleDeactivateCustomer}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleActivateCustomer}
            >
              Activate
            </Button>
          )}
          {/* <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteCustomer}
          >
            Delete Permanently
          </Button> */}
        </div>
      </div>

      <Card
        className="shadow-lg rounded-xl border border-gray-200"
        title={<span className="text-lg font-semibold text-indigo-600">Customer Details</span>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <InfoItem
            label="ID"
            value={
              <div className="flex items-center gap-2">
                <span className="text-red-600">{customer.id}</span>
                <Tooltip title="Copy ID">
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopy(customer.id, 'ID')}
                  />
                </Tooltip>
              </div>
            }
          />
          <InfoItem label="Full Name" value={customer.full_name} />
          <InfoItem label="Phone" value={customer.phone_number} />
          <InfoItem label="Gender" value={customer.gender} />
          <InfoItem label="DOB" value={new Date(customer.dob).toLocaleDateString()} />
          <InfoItem label="Account Type" value={customer.account_type} />
          <InfoItem label="City" value={customer.city} />
          <InfoItem label="State" value={customer.state} />
          <InfoItem label="Address" value={customer.address} className="sm:col-span-2" />
          <InfoItem label="Aadhar No" value={customer.aadhar_number} />
          <InfoItem label="PAN No" value={customer.pan_number} />
          <InfoItem
            label="Current Balance"
            value={<span className="text-green-600 font-bold">₹{getCustomerBalance(id)}</span>}
          />
          <InfoItem
            label="Status"
            value={
              <Tag color={customer.is_active ? 'green' : 'red'}>
                {customer.is_active ? 'Active' : 'Inactive'}
              </Tag>
            }
          />
        </div>
      </Card>

      <Tabs defaultActiveKey="trades" className="mt-6">
        <TabPane tab="📊 Trade History" key="trades">
          <Table
            dataSource={customerTrades}
            loading={tradeLoading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Trade No', dataIndex: 'trade_number' },
              { title: 'Stock Name', dataIndex: 'instrument' },
              {
                title: 'Buy',
                render: (trade) => `${trade.buy_quantity} @ ₹${trade.buy_price}`,
              },
              {
                title: 'Sell',
                render: (trade) =>
                  trade.exit_quantity
                    ? `${trade.exit_quantity} @ ₹${trade.exit_price}`
                    : 'N/A',
              },
              { title: 'Buy Value', render: (trade) => `₹${trade.buy_value}` },
              { title: 'Sell Value', render: (trade) => `₹${trade.exit_value || '0.00'}` },
              {
                title: 'Profit/Loss',
                render: (trade) => (
                  <Tag color={trade.profit_loss === 'loss' ? 'red' : 'green'}>
                    ₹{parseFloat(trade.profit_loss_value).toFixed(2)}
                  </Tag>
                ),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (status) => (
                  <Tag color={status === 'approved' ? 'green' : status === 'hold' ? 'blue' : 'red'}>
                    {status.toUpperCase()}
                  </Tag>
                ),
              },
              {
                title: 'Actions',
                render: (trade) => (
                  <div className="flex gap-2">
                    <Tooltip title="View Trade">
                      <Button
                        type="link"
                        onClick={() => navigate(`/admin/trades/${trade.id}`)}
                      >
                        View
                      </Button>
                    </Tooltip>
                    {trade.status === 'hold' && (
                      <Tooltip title="Approve Trade">
                        <Button
                          type="primary"
                          size="small"
                          icon={<CheckCircleOutlined />}
                          onClick={() => handleApproveTrade(trade.id)}
                        />
                      </Tooltip>
                    )}
                    {trade.status !== 'deactivated' && (
                      <Tooltip title="Deactivate Trade">
                        <Button
                          type="default"
                          danger
                          size="small"
                          icon={<StopOutlined />}
                          onClick={() => handleDeactivateTrade(trade.id)}
                        />
                      </Tooltip>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </TabPane>

        <TabPane tab="💸 Transaction History" key="transactions">
          <Table
            dataSource={customerTransactions}
            loading={loadingTransactions}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Transaction ID', dataIndex: 'id' },
              {
                title: 'Type',
                dataIndex: 'type',
                render: (type) => (
                  <Tag color={type === 'credit' ? 'green' : 'red'}>{type.toUpperCase()}</Tag>
                ),
              },
              { title: 'Amount', render: (tx) => `₹${parseFloat(tx.amount).toFixed(2)}` },
              { title: 'Description', dataIndex: 'description' },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (status) => (
                  <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'blue' : 'red'}>
                    {status.toUpperCase()}
                  </Tag>
                ),
              },
              { title: 'Date', dataIndex: 'created_at', render: (date) => dayjs(date).format('DD MMM YYYY, hh:mm A') },
            ]}
          />
        </TabPane>

        <TabPane tab="📥 Fund Requests" key="fundRequests">
          <Table
            dataSource={customerFundRequests}
            loading={loadingFundRequests}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Request ID', dataIndex: 'id' },
              { title: 'Amount', render: (fr) => `₹${parseFloat(fr.amount).toFixed(2)}` },
              { title: 'Method', dataIndex: 'method' },
              { title: 'UTR Number', dataIndex: 'utr_number' },
              {
                title: "Screenshot",
                dataIndex: "screenshot",
                render: (src) =>
                  src ? (
                    <Image
                      src={src}
                      alt="Payment Screenshot"
                      width={60}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: 8, maxWidth: "95%" }}
                    />
                  ) : (
                    "N/A"
                  ),
              },
              { title: 'Note', dataIndex: 'note' },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (status) => (
                  <Tag color={status === 'successful' ? 'green' : status === 'pending' ? 'blue' : 'red'}>
                    {status.toUpperCase()}
                  </Tag>
                ),
              },
              { title: 'Created At', dataIndex: 'created_at', render: (date) => dayjs(date).format('DD MMM YYYY, hh:mm A') },
              {
                title: 'Actions',
                render: (_, record) => record.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={() => setShowApproveModal(true, setApproveData({ requestId: record.id, amount: record.amount }))}
                    >
                      Approve
                    </Button>
                    <Button
                      type="default"
                      danger
                      size="small"
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleRejectFundRequest(record.id)}
                    >
                      Reject
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </TabPane>

        <TabPane tab="📤 Withdrawal History" key="withdrawals">
          <Table
            dataSource={customerWithdrawals}
            loading={loadingWithdrawals}
            rowKey="withdrawal_id"
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Withdrawal ID', dataIndex: 'withdrawal_id' },
              { title: 'Amount', render: (wd) => `₹${parseFloat(wd.amount).toFixed(2)}` },
              { title: 'Account Number', dataIndex: 'account_number' },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (status) => (
                  <Tag color={status === 'completed' ? 'green' : status === 'requested' ? 'blue' : 'red'}>
                    {status.toUpperCase()}
                  </Tag>
                ),
              },
              { title: 'Created At', dataIndex: 'created_at', render: (date) => dayjs(date).format('DD MMM YYYY, hh:mm A') },
              { title: 'Updated At', dataIndex: 'updated_at', render: (date) => dayjs(date).format('DD MMM YYYY, hh:mm A') },
              {
                title: 'Actions',
                render: (_, record) => record.status === 'requested' && (
                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleWithdrawalAction(record.withdrawal_id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      type="default"
                      danger
                      size="small"
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleWithdrawalAction(record.withdrawal_id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </TabPane>
      </Tabs>

      <Modal
        title="Top-Up/Debit Wallet"
        open={showTopUpModal}
        onOk={handleTopUp}
        onCancel={() => setShowTopUpModal(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <InputNumber
              min={0}
              value={topUpData.amount}
              onChange={(value) => setTopUpData({ ...topUpData, amount: value })}
              className="w-full"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <Select
              value={topUpData.type}
              onChange={(value) => setTopUpData({ ...topUpData, type: value })}
              className="w-full"
            >
              <Select.Option value="credit">Credit</Select.Option>
              <Select.Option value="debit">Debit</Select.Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={topUpData.description}
              onChange={(e) => setTopUpData({ ...topUpData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Optional description"
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Confirm Fund Request Approval"
        open={showApproveModal}
        onOk={handleApproveFundRequest}
        onCancel={() => setShowApproveModal(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <p>Please confirm the amount to approve for this fund request.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <InputNumber
              min={0}
              value={approveData.amount}
              onChange={(value) => setApproveData({ ...approveData, amount: value })}
              className="w-full"
              placeholder="Enter amount"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const InfoItem = ({ label, value, className = '' }) => (
  <div className={`bg-white rounded border p-3 shadow-sm ${className}`}>
    <div className="text-gray-500 font-medium">{label}</div>
    <div className="font-semibold text-gray-800">{value}</div>
  </div>
);

export default CustomerDetails;