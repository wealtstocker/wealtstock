import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Input, Tag, Button, Space, Popconfirm, Modal
} from 'antd';
import {
  fetchAllCustomers,
  deleteCustomer,
  activateCustomer,
} from '../../../redux/Slices/customerSlice';
import Toast from '../../../services/toast';
import { SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import CustomerViewModal from './CustomerViewModal';
import CustomerEditModal from './CustomerEditModal';

const CustomerTable = () => {
  const dispatch = useDispatch();
  const { all: customers, loading } = useSelector((state) => state.customer);

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(
      searchText
        ? customers.filter((c) =>
            c.full_name?.toLowerCase().includes(searchText.toLowerCase())
          )
        : customers
    );
  }, [searchText, customers]);

  const handleToggle = async (cust) => {
    const action = cust.is_active ? deleteCustomer : activateCustomer;
    dispatch(action(cust.id)).then(() => dispatch(fetchAllCustomers()));
  };

  const columns = useMemo(
    () => [
      {
        title: '#',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Name',
        dataIndex: 'full_name',
        sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Phone',
        dataIndex: 'phone_number',
      },
      {
        title: 'Status',
        dataIndex: 'is_active',
        render: (is_active) => (
          <Tag color={is_active ? 'green' : 'red'}>
            {is_active ? 'Active' : 'Inactive'}
          </Tag>
        ),
        filters: [
          { text: 'Active', value: true },
          { text: 'Inactive', value: false },
        ],
        onFilter: (value, record) => record.is_active === value,
      },
      {
        title: 'Action',
        render: (_, record) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedCustomer(record);
                setViewModal(true);
              }}
            />
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedCustomer(record);
                setEditModal(true);
              }}
            />
            <Popconfirm
              title={`Are you sure to ${record.is_active ? 'deactivate' : 'activate'} this customer?`}
              onConfirm={() => handleToggle(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">
                {record.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4 sm:p-6 bg-white rounded shadow-sm overflow-auto">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Customer Management</h2>
      <Input
        placeholder="Search by name"
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 w-full sm:w-80"
      />
      <Table
        columns={columns}
        dataSource={filteredData.map((c) => ({ ...c, key: c.id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: 'max-content' }}
      />

      <CustomerViewModal
        open={viewModal}
        onClose={() => setViewModal(false)}
        customer={selectedCustomer}
      />
      <CustomerEditModal
        open={editModal}
        onClose={() => setEditModal(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomerTable;
