import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Row, Col, Tag, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTransactions } from '../../../redux/Slices/balanceSlice';

const { Option } = Select;

const AdminTransactionList = () => {
  const dispatch = useDispatch();
 const { transactions, loadingTransactions } = useSelector((state) => state.balance);
// console.log("tttt", transactions)
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [transactions, search, typeFilter, statusFilter]);

  const filterData = () => {
    let data = [...transactions];

    if (search) {
      data = data.filter(
        (t) =>
          t.customer_id.toLowerCase().includes(search.toLowerCase()) ||
          t.customer_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      data = data.filter((t) => t.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      data = data.filter((t) => t.status === statusFilter);
    }

    setFilteredData(data);
  };

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer_name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: [
        { text: 'Credit', value: 'credit' },
        { text: 'Debit', value: 'debit' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <Tag color={type === 'credit' ? 'green' : 'red'}>{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
      render: (amount) => `₹${parseFloat(amount).toFixed(2)}`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) =>
        new Date(date).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Transactions</h2>

      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Input
            placeholder="Search by Customer ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Select
            value={typeFilter}
            onChange={(value) => setTypeFilter(value)}
            style={{ width: '100%' }}
          >
            <Option value="all">All Types</Option>
            <Option value="credit">Credit</Option>
            <Option value="debit">Debit</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: '100%' }}
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Col>
      </Row>

      {loadingTransactions ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AdminTransactionList;
