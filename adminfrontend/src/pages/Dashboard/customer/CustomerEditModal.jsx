import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { updateCustomer, fetchAllCustomers } from '../../../redux/Slices/customerSlice';

const CustomerEditModal = ({ open, onClose, customer }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(updateCustomer({ id: customer.id, formData: values })).then(() => {
      dispatch(fetchAllCustomers());
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      title="✏️ Edit Customer"
    >
      <Form form={form} layout="vertical" initialValues={customer} onFinish={onFinish}>
        <Form.Item name="full_name" label="Full Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="phone_number" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="city" label="City">
          <Input />
        </Form.Item>
        <Form.Item name="state" label="State">
          <Input />
        </Form.Item>
        <Form.Item name="account_type" label="Account Type">
          <Select options={[{ value: 'basic' }, { value: 'premium' }]} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerEditModal;
