import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Input,
  Tag,
  Button,
  Space,
  Popconfirm,
  Modal,
  
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import {
  fetchAllCustomers,
  updateCustomer,
} from '../../../redux/Slices/customerSlice';
import Toast from '../../../services/toast';

const CustomerTable = () => {
  const dispatch = useDispatch();
  const { all: customers, loading } = useSelector((state) => state.customer);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (searchText) {
      setFilteredData(
        customers.filter((c) =>
          c.full_name?.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFilteredData(customers);
    }
  }, [searchText, customers]);

  const handleActivateToggle = (cust) => {
    dispatch(
      updateCustomer({
        id: cust.id,
        formData: { ...cust, is_active: !cust.is_active },
      })
    ).then(() => {
      Toast.success(
        `Customer ${cust.is_active ? 'deactivated' : 'activated'} successfully`
      );
      dispatch(fetchAllCustomers());
    });
  };

  const columns = useMemo(
    () => [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Name',
        dataIndex: 'full_name',
        key: 'full_name',
        sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Phone',
        dataIndex: 'phone_number',
        key: 'phone_number',
      },
      {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
      },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
      },
      {
        title: 'Status',
        dataIndex: 'is_active',
        key: 'is_active',
        render: (is_active) =>
          is_active ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          ),
        filters: [
          { text: 'Active', value: true },
          { text: 'Inactive', value: false },
        ],
        onFilter: (value, record) => record.is_active === value,
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              type="primary"
              className="!bg-blue-500 !text-white hover:!bg-blue-600"
              size="small"
              onClick={() => {
                setSelectedCustomer(record);
                setViewModal(true);
              }}
            />
            <Popconfirm
              title={`Are you sure to ${
                record.is_active ? 'deactivate' : 'activate'
              } this customer?`}
              onConfirm={() => handleActivateToggle(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type="primary">
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
      <h2 className="text-xl font-semibold mb-4 text-blue-600">
        Customer Management
      </h2>

      <div className="mb-4">
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:w-80"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData.map((c) => ({ ...c, key: c.id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
        scroll={{ x: 'max-content' }}
      />

      <Modal
  open={viewModal}
  onCancel={() => setViewModal(false)}
  footer={null}
  title={<span className="font-bold text-lg text-blue-700 border-b-2 border-dashed pb-1 "   >👤 Customer Overview</span>}
  className="max-w-full sm:max-w-3xl"
  bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
>
  {selectedCustomer ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base text-gray-700 break-words">
      {/* Personal Info */}
      <div className="col-span-2 mb-2">
        <h3 className="text-blue-600 font-semibold text-base my-2">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl">
          <p><strong>Customer ID:</strong> {selectedCustomer.id}</p>
          <p><strong>Full Name:</strong> {selectedCustomer.full_name}</p>
          <p><strong>Gender:</strong> {selectedCustomer.gender || "N/A"}</p>
          <p><strong>DOB:</strong> {selectedCustomer.dob ? new Date(selectedCustomer.dob).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="col-span-2 mb-2">
        <h3 className="text-blue-600 font-semibold text-base mb-1">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Email:</strong> <a href={`mailto:${selectedCustomer.email}`} className="text-blue-500 underline">{selectedCustomer.email}</a></p>
          <p><strong>Phone:</strong> <a href={`tel:${selectedCustomer.phone_number}`} className="text-blue-500 underline">{selectedCustomer.phone_number}</a></p>
        </div>
      </div>

      {/* Account Info */}
      <div className="col-span-2 mb-2">
        <h3 className="text-blue-600 font-semibold text-base mb-1">Account & KYC</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Account Type:</strong> {selectedCustomer.account_type || "N/A"}</p>
          <p><strong>Aadhar No:</strong> {selectedCustomer.aadhar_number || "N/A"}</p>
          <p><strong>PAN No:</strong> {selectedCustomer.pan_number || "N/A"}</p>
          <p className='text-red-400'><strong>Password:</strong> <span className="break-all  text-red-400">{selectedCustomer.password_hash}</span></p>
          {selectedCustomer.document_url && (
            <p className="col-span-2">
              <strong>Document:</strong>{" "}
              <a
                href={`${import.meta.env.VITE_BASE_URL}/${selectedCustomer.document_url.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Document
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Address Info */}
      <div className="col-span-2">
        <h3 className="text-blue-600 font-semibold text-base mb-1">Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Address:</strong> {selectedCustomer.address}</p>
          <p><strong>City:</strong> {selectedCustomer.city}</p>
          <p><strong>State:</strong> {selectedCustomer.state}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-gray-500">No customer data available.</div>
  )}
</Modal>

    </div>
  );
};

export default CustomerTable;
