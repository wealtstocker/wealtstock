import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Spin, Button, Modal, InputNumber, Select, Alert, Tabs, Tag, Tooltip } from 'antd';
import { DollarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  fetchAllBalances,
  updateWalletBalance,
  fetchAllFundRequests,
  fetchAllWithdrawals,
  approveFundRequest,
  rejectFundRequest,
  updateWithdrawalStatus,
  clearError,
} from '../../../redux/Slices/walletSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';
import Toast from '../../../services/toast';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const AdminCustomerBalances = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    balances,
    fundRequests,
    withdrawals,
    loadingBalances,
    loadingFundRequests,
    loadingWithdrawals,
    error,
  } = useSelector((state) => state.wallet);
  const { all: customers, loading: customerLoading } = useSelector((state) => state.customer);

  const [filteredBalances, setFilteredBalances] = useState([]);
  const [filteredFundRequests, setFilteredFundRequests] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [search, setSearch] = useState('');
  const [fundStatusFilter, setFundStatusFilter] = useState('all');
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState('all');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpData, setTopUpData] = useState({ customerId: '', amount: '', type: 'credit', description: '' });
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveData, setApproveData] = useState({ requestId: '', amount: '' });

  useEffect(() => {
    dispatch(fetchAllBalances());
    dispatch(fetchAllCustomers());
    dispatch(fetchAllFundRequests());
    dispatch(fetchAllWithdrawals());
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [balances, customers, fundRequests, withdrawals, search, fundStatusFilter, withdrawalStatusFilter]);

  const filterData = () => {
    if (!balances) {
      setFilteredBalances([]);
      setFilteredFundRequests([]);
      setFilteredWithdrawals([]);
      return;
    }

    // Filter Balances
    let balanceData = balances.map((bal) => {
      const customer = customers.find((c) => c.id === bal.customer_id);
      return {
        ...bal,
        full_name: customer?.full_name || 'N/A',
        email: customer?.email || 'N/A',
      };
    });

    // Filter Fund Requests
    let fundRequestData = fundRequests.map((fr) => {
      const customer = customers.find((c) => c.id === fr.customer_id);
      return {
        ...fr,
        full_name: customer?.full_name || 'N/A',
        email: customer?.email || 'N/A',
      };
    });

    // Filter Withdrawals
    let withdrawalData = withdrawals.map((wd) => {
      const customer = customers.find((c) => c.id === wd.customer_id);
      return {
        ...wd,
        full_name: customer?.full_name || 'N/A',
        email: customer?.email || 'N/A',
      };
    });

    if (search) {
      const searchLower = search.toLowerCase();
      balanceData = balanceData.filter(
        (item) => item.customer_id.toLowerCase().includes(searchLower) || item.full_name.toLowerCase().includes(searchLower) || item.email.toLowerCase().includes(searchLower)
      );
      fundRequestData = fundRequestData.filter(
        (item) => item.customer_id.toLowerCase().includes(searchLower) || item.full_name.toLowerCase().includes(searchLower) || item.email.toLowerCase().includes(searchLower)
      );
      withdrawalData = withdrawalData.filter(
        (item) => item.customer_id.toLowerCase().includes(searchLower) || item.full_name.toLowerCase().includes(searchLower) || item.email.toLowerCase().includes(searchLower)
      );
    }

    if (fundStatusFilter !== 'all') {
      fundRequestData = fundRequestData.filter((item) => item.status === fundStatusFilter);
    }

    if (withdrawalStatusFilter !== 'all') {
      withdrawalData = withdrawalData.filter((item) => item.status === withdrawalStatusFilter);
    }

    setFilteredBalances(balanceData);
    setFilteredFundRequests(fundRequestData);
    setFilteredWithdrawals(withdrawalData);
  };

  const handleTopUp = async () => {
    if (!topUpData.customerId || !topUpData.amount || topUpData.amount <= 0) {
      Toast.error('Please select a customer and enter a valid amount');
      return;
    }
    try {
      await dispatch(
        updateWalletBalance({
          customerId: topUpData.customerId,
          amount: topUpData.amount,
          type: topUpData.type,
          description: topUpData.description || `Manual ${topUpData.type} by admin`,
        })
      ).unwrap();
      setShowTopUpModal(false);
      setTopUpData({ customerId: '', amount: '', type: 'credit', description: '' });
      Toast.success('Wallet updated successfully');
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
      console.error(err)
      // Error handled by thunk
    }
  };

  const balanceColumns = [
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
      sorter: (a, b) => a.customer_id.localeCompare(b.customer_id),
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: (a, b) => parseFloat(a.balance) - parseFloat(b.balance),
      render: (amount) => (
        <span className={amount < 0 ? 'text-red-500' : 'text-green-500'}>
          ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => setShowTopUpModal(true, setTopUpData({ ...topUpData, customerId: record.customer_id }))}
        >
          Top-Up/Debit
        </Button>
      ),
    },
  ];

  const fundRequestColumns = [
    { title: 'Request ID', dataIndex: 'id' },
    { title: 'Customer ID', dataIndex: 'customer_id' },
    { title: 'Full Name', dataIndex: 'full_name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Amount', render: (fr) => `₹${parseFloat(fr.amount).toFixed(2)}` },
    { title: 'Method', dataIndex: 'method' },
    { title: 'UTR Number', dataIndex: 'utr_number' },
    {
      title: 'Screenshot',
      dataIndex: 'screenshot',
      render: (url) => url ? (
        <a href={`${import.meta.env.VITE_BASE_URL}/${url.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          View
        </a>
      ) : 'N/A',
    },
    { title: 'Status', dataIndex: 'status', render: (status) => (
      <Tag color={status === 'successful' ? 'green' : status === 'pending' ? 'blue' : 'red'}>
        {status.toUpperCase()}
      </Tag>
    ) },
    { title: 'Created At', dataIndex: 'created_at', render: (date) => dayjs(date).format('DD MMM YYYY, hh:mm A') },
    {
      title: 'Actions',
      render: (_, record) => record.status === 'pending' && (
        <div className="flex gap-2">
          <Tooltip title="Approve Fund Request">
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => setShowApproveModal(true, setApproveData({ requestId: record.id, amount: record.amount }))}
            >
              Approve
            </Button>
          </Tooltip>
          <Tooltip title="Reject Fund Request">
            <Button
              type="default"
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleRejectFundRequest(record.id)}
            >
              Reject
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const withdrawalColumns = [
    { title: 'Withdrawal ID', dataIndex: 'withdrawal_id' },
    { title: 'Customer ID', dataIndex: 'customer_id' },
    { title: 'Full Name', dataIndex: 'full_name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Amount', render: (wd) => `₹${parseFloat(wd.amount).toFixed(2)}` },
    { title: 'Account Number', dataIndex: 'account_number' },
    { title: 'Status', dataIndex: 'status', render: (status) => (
      <Tag color={status === 'completed' ? 'green' : status === 'requested' ? 'blue' : 'red'}>
        {status.toUpperCase()}
      </Tag>
    ) },
    { title: 'Created At', dataIndex: 'created_at', render: (date) => dayjs(date).format('DD MMM YYYY, hh:mm A') },
    {
      title: 'Actions',
      render: (_, record) => record.status === 'requested' && (
        <div className="flex gap-2">
          <Tooltip title="Approve Withdrawal">
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleWithdrawalAction(record.withdrawal_id, 'approve')}
            >
              Approve
            </Button>
          </Tooltip>
          <Tooltip title="Reject Withdrawal">
            <Button
              type="default"
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleWithdrawalAction(record.withdrawal_id, 'reject')}
            >
              Reject
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">
          Customer Balances
          <span className="ml-2 text-sm text-gray-500">
            ({filteredBalances.length} customers, {filteredFundRequests.filter(fr => fr.status === 'pending').length} pending fund requests, {filteredWithdrawals.filter(wd => wd.status === 'requested').length} pending withdrawals)
          </span>
        </h2>
        <Button
          type="primary"
          icon={<DollarOutlined />}
          onClick={() => setShowTopUpModal(true)}
        >
          Add Funds
        </Button>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
          closable
          onClose={() => dispatch(clearError())}
        />
      )}

      <Input
        placeholder="Search by ID, name, or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-1/2 mb-6"
        allowClear
      />

      {(loadingBalances || customerLoading || loadingFundRequests || loadingWithdrawals) ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="balances">
          <TabPane tab="Balances" key="balances">
            <Table
              columns={balanceColumns}
              dataSource={filteredBalances}
              rowKey="customer_id"
              pagination={{ pageSize: 10 }}
              rowClassName="cursor-pointer hover:bg-gray-50"
              onRow={(record) => ({
                onClick: () => navigate(`/admin/customer/${record.customer_id}`),
              })}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          <TabPane tab="Fund Requests" key="fundRequests">
            <Select
              value={fundStatusFilter}
              onChange={(value) => setFundStatusFilter(value)}
              className="w-full sm:w-48 mb-4"
            >
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="successful">Successful</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
            <Table
              columns={fundRequestColumns}
              dataSource={filteredFundRequests}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          <TabPane tab="Withdrawals" key="withdrawals">
            <Select
              value={withdrawalStatusFilter}
              onChange={(value) => setWithdrawalStatusFilter(value)}
              className="w-full sm:w-48 mb-4"
            >
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="requested">Requested</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
            <Table
              columns={withdrawalColumns}
              dataSource={filteredWithdrawals}
              rowKey="withdrawal_id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
        </Tabs>
      )}

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
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <Select
              placeholder="Select customer"
              value={topUpData.customerId}
              onChange={(value) => setTopUpData({ ...topUpData, customerId: value })}
              className="w-full"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {customers.map((customer) => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.full_name} (ID: {customer.id})
                </Select.Option>
              ))}
            </Select>
          </div>
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
            <Input
              value={topUpData.description}
              onChange={(e) => setTopUpData({ ...topUpData, description: e.target.value })}
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

export default AdminCustomerBalances;