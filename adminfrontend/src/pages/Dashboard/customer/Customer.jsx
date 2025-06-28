import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Input,
  Tag,
  Button,
  Space,
  Tooltip,
} from 'antd';
import {
  fetchAllCustomers,
  deleteCustomerPermanently,
  activateCustomer,
  deactivateCustomer,
} from '../../../redux/Slices/customerSlice';
import Toast from '../../../services/toast';
import Swal from 'sweetalert2';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
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

  const handleCopy = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    Toast.success(`${label} copied to clipboard`);
  };

  const handleToggleStatus = async (cust) => {
    const action = cust.is_active ? deactivateCustomer : activateCustomer;
    dispatch(action(cust.id)).then(() => dispatch(fetchAllCustomers()));
  };

  const handleHardDelete = async (cust) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Permanently delete customer "${cust.full_name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete permanently',
    });

    if (result.isConfirmed) {
      dispatch(deleteCustomerPermanently(cust.id)).then(() =>
        dispatch(fetchAllCustomers())
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        title: '#',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Customer ID',
        dataIndex: 'id',
        render: (id) => (
          <Space>
            {id}
            <Tooltip title="Copy ID">
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => handleCopy(id, 'Customer ID')}
              />
            </Tooltip>
          </Space>
        ),
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
        title: 'Actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedCustomer(record);
                  setViewModal(true);
                }}
              />
            </Tooltip>

            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedCustomer(record);
                  setEditModal(true);
                }}
              />
            </Tooltip>

            <Tooltip title={record.is_active ? 'Deactivate' : 'Activate'}>
              <Button
                type={record.is_active ? 'default' : 'primary'}
                onClick={() => handleToggleStatus(record)}
              >
                {record.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            </Tooltip>

            <Tooltip title="Hard Delete">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleHardDelete(record)}
              />
            </Tooltip>
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
