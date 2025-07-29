import React, { useEffect, useState } from 'react';
import { Table, Input, Tag, Button, Space, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCustomers, activateCustomer, deleteCustomerPermanently } from '../../../redux/Slices/customerSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Toast from '../../../services/toast';

const CustomerInactivePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { all: customers, loading } = useSelector((state) => state.customer);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const filteredCustomers = customers
    .filter((cust) => !cust.is_active)
    .filter((cust) => cust.full_name?.toLowerCase().includes(searchText.toLowerCase()));

  // Activate a customer with confirmation
  const handleActivate = async (id) => {
    const result = await Swal.fire({
      title: 'Activate Customer',
      text: 'Are you sure you want to activate this customer? Credentials will be sent via SMS and Email.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, activate',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(activateCustomer(id)).unwrap();
        dispatch(fetchAllCustomers());
        // Toast.success('Customer activated and credentials sent');
      } catch (err) {
        Toast.error('Failed to activate customer');
      }
    }
  };

  // Permanently delete a customer with confirmation
  const handleDelete = async (cust) => {
    const result = await Swal.fire({
      title: 'Delete permanently?',
      text: `Are you sure you want to delete "${cust.full_name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, delete',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteCustomerPermanently(cust.id)).unwrap();
        dispatch(fetchAllCustomers());
        Toast.success('Customer permanently deleted');
      } catch (err) {
        Toast.error('Failed to delete customer');
      }
    }
  };

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      responsive: ['sm'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      render: () => <Tag color="red">Inactive</Tag>,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => navigate(`/admin/customer/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/customer/edit/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Activate">
            <Button type="primary" onClick={() => handleActivate(record.id)}>
              Activate
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-white rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Inactive Customers</h2>

      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:w-80"
        />
        <Button onClick={() => navigate('/admin/customers')} className="bg-blue-500 text-white hover:bg-blue-600">
          Back to All Customers
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredCustomers.map((cust) => ({ ...cust, key: cust.id }))}
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default CustomerInactivePage;