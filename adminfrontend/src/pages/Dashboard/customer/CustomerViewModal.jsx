import React from 'react';
import { Modal, Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import Toast from '../../../services/toast';

const CustomerViewModal = ({ open, onClose, customer }) => {
  if (!customer) return null;

  const handleCopy = (value, label) => {
    navigator.clipboard.writeText(value);
    Toast.success(`${label} copied to clipboard`);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<span className="font-bold text-lg text-blue-700 border-b-2 border-dashed pb-1">👤 Customer Overview</span>}
      className="max-w-full sm:max-w-3xl"
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base text-gray-700 break-words">
        {/* Personal Info */}
        <div className="col-span-2 mb-2">
          <h3 className="text-blue-600 font-semibold text-base my-2">Personal Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl">
            <p>
              <strong>Customer ID:</strong> {customer.id}{' '}
              <Tooltip title="Copy ID">
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  className="ml-1"
                  onClick={() => handleCopy(customer.id, 'Customer ID')}
                />
              </Tooltip>
            </p>
            <p><strong>Full Name:</strong> {customer.full_name}</p>
            <p><strong>Gender:</strong> {customer.gender || 'N/A'}</p>
            <p><strong>DOB:</strong> {customer.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="col-span-2 mb-2">
          <h3 className="text-blue-600 font-semibold text-base mb-1">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${customer.email}`} className="text-blue-500 underline">
                {customer.email}
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{' '}
              <a href={`tel:${customer.phone_number}`} className="text-blue-500 underline">
                {customer.phone_number}
              </a>
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="col-span-2 mb-2">
          <h3 className="text-blue-600 font-semibold text-base mb-1">Account & KYC</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><strong>Account Type:</strong> {customer.account_type || 'N/A'}</p>
            <p><strong>Aadhar No:</strong> {customer.aadhar_number || 'N/A'}</p>
            <p><strong>PAN No:</strong> {customer.pan_number || 'N/A'}</p>
            <p className="text-red-400">
              <strong>Password:</strong>{' '}
              <span className="break-all text-red-400">{customer.password_hash}</span>{' '}
              <Tooltip title="Copy Password">
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  className="ml-1"
                  onClick={() => handleCopy(customer.password_hash, 'Password')}
                />
              </Tooltip>
            </p>
            {customer.document_url && (
              <p className="col-span-2">
                <strong>Document:</strong>{' '}
                <a
                  href={`${import.meta.env.VITE_BASE_URL}/${customer.document_url.replace(/\\/g, '/')}`}
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
            <p><strong>Address:</strong> {customer.address}</p>
            <p><strong>City:</strong> {customer.city}</p>
            <p><strong>State:</strong> {customer.state}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerViewModal;
