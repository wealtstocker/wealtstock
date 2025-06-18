import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerById } from '../../../redux/Slices/customerSlice';

const CustomerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: customer, loading, error } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(fetchCustomerById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!customer) {
    return <p className="text-center text-gray-500">Customer not found.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">Customer Details</h2>
      <Card bordered>
        <div className="space-y-2">
          <p><strong>ID:</strong> {customer.id}</p>
          <p><strong>Full Name:</strong> {customer.full_name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone_number}</p>
          <p><strong>Aadhar Number:</strong> {customer.aadhar_number}</p>
          <p><strong>PAN Number:</strong> {customer.pan_number}</p>
          <p><strong>Gender:</strong> {customer.gender}</p>
          <p><strong>Date of Birth:</strong> {new Date(customer.dob).toLocaleDateString()}</p>
          <p><strong>Account Type:</strong> {customer.account_type}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>City:</strong> {customer.city}</p>
          <p><strong>State:</strong> {customer.state}</p>
          {customer.document_url && (
            <p>
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
      </Card>
    </div>
  );
};

export default CustomerDetails;
