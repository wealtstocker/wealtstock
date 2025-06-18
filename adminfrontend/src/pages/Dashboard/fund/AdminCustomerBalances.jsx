import React, { useEffect, useState } from 'react';
import { Table, Input, Row, Col, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBalances } from '../../../redux/Slices/balanceSlice';
import { fetchAllCustomers } from '../../../redux/Slices/customerSlice';

const AdminCustomerBalances = () => {
  const dispatch = useDispatch();
  const { balances, loading: balanceLoading } = useSelector((state) => state.balance);
  const { all: customers, loading: customerLoading } = useSelector((state) => state.customer);

  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAllBalances());
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [balances, customers, search]);

  const filterData = () => {
    let data = balances.map((bal) => {
      const customer = customers.find((c) => c.customer_id === bal.customer_id);
      return {
        ...bal,
        full_name: customer?.full_name || 'N/A',
        email: customer?.email || 'N/A',
      };
    });

    if (search) {
      data = data.filter(
        (item) =>
          item.customer_id.toLowerCase().includes(search.toLowerCase()) ||
          item.full_name.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(data);
  };

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: (a, b) => parseFloat(a.balance) - parseFloat(b.balance),
      render: (amount) => `₹${parseFloat(amount).toLocaleString()}`,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Customer Balances</h2>

      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Input
            placeholder="Search by ID, name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      {balanceLoading || customerLoading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="customer_id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AdminCustomerBalances;
