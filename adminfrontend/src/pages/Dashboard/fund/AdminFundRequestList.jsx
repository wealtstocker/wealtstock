import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Spin,
  Input,
  Select,
  Row,
  Col,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleOutlined } from '@ant-design/icons';
import {
  approveFundRequest,
  fetchFundRequests,
} from '../../../redux/Slices/fundSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';
import Toast from '../../../services/toast';

const AdminFundRequestList = () => {
  const dispatch = useDispatch();

  const { fundRequests, loading } = useSelector((state) => state.fund);
  const { all: customers, loading: customerLoading } = useSelector(
    (state) => state.customer
  );

  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchFundRequests());
  }, [dispatch]);
// console.log(customers)
  useEffect(() => {
    filterData();
  }, [fundRequests, customers, search, statusFilter]);

  const filterData = () => {
    let data = fundRequests.map((fund) => {
      const customer = customers.find((c) => c.id === fund.customer_id);
      return {
        ...fund,
        full_name: customer?.full_name || 'N/A',
        email: customer?.email || 'N/A',
      };
    });

    if (search) {
      data = data.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      data = data.filter((item) => item.status === statusFilter);
    }

    setFilteredData(data);
  };

  const handleApprove = async (id) => {
    try {
      await dispatch(approveFundRequest(id)).unwrap();
      Toast.success('✅ Fund approved successfully');
      dispatch(fetchFundRequests()); // Refresh after approval
    } catch (err) {
      Toast.error('❌ Failed to approve fund');
    }
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'full_name',
      sorter: (a, b) => a.full_name?.localeCompare(b.full_name),
      render: (name) => name || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (email) => email || 'N/A',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
      render: (amount) => `₹${parseFloat(amount).toLocaleString()}`,
    },
    {
      title: 'UTR Number',
      dataIndex: 'utr_number',
      render: (utr) => utr || 'N/A',
    },
    // {
    //   title: 'Screenshot',
    //   dataIndex: 'screenshot',
    //   render: (src) =>
    //     src ? (
    //       <a href={`/${src}`} target="_blank" rel="noreferrer">
    //         <img src={`/${src}`} alt="screenshot" width={50} height={50} />
    //       </a>
    //     ) : (
    //       'N/A'
    //     ),
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Successful', value: 'successful' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'successful' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
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
    {
      title: 'Actions',
      render: (_, record) =>
        record.status !== 'successful' ? (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record.id)}
          >
            Approve
          </Button>
        ) : (
          <Tag color="green">Approved</Tag>
        ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Fund Requests</h2>

      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: '100%' }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="successful">Successful</Select.Option>
          </Select>
        </Col>
      </Row>

      {loading || customerLoading ? (
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

export default AdminFundRequestList;
