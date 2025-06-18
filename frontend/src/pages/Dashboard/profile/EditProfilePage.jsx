import React, { useState, useEffect } from 'react';
import {
  Input,
  Form,
  Button,
  Upload,
  Avatar,
  Select,
  DatePicker,
} from 'antd';
import {
  UserOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { updateCustomer } from '../../../redux/Slices/customerSlice';

const EditProfilePage = ({ userData, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        dob: userData.dob ? dayjs(userData.dob) : null,
      });
    }
  }, [userData, form]);

  const handleAvatarChange = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target.result);
    reader.readAsDataURL(file.originFileObj);
  };

  const handleFormSubmit = async (values) => {
    const formData = {
      ...values,
      dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
      avatar: avatar || userData.avatar || '',
    };
    await dispatch(updateCustomer({ id: userData.id, formData }));
    if (onClose) onClose(); // close edit mode
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-8 bg-gray-50">
      <div className="w-full max-w-7xl p-8 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-blue-600 hover:underline text-sm flex items-center"
          >
            <ArrowLeftOutlined className="mr-1" /> Back
          </button>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleFormSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar */}
            <Form.Item label="Avatar" className="md:col-span-2 text-center">
              <Upload
                showUploadList={false}
                onChange={handleAvatarChange}
              >
                <Avatar
                  size={80}
                  src={avatar || userData?.avatar}
                  icon={<UserOutlined />}
                  className="cursor-pointer shadow-md mx-auto border"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Click to change
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Your name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true }, { type: 'email' }]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="Phone"
              rules={[{ required: true }]}
            >
              <Input placeholder="+91 9876543210" />
            </Form.Item>

            <Form.Item name="dob" label="Date of Birth">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="gender" label="Gender">
              <Select placeholder="Select Gender">
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="pan" label="PAN Number">
              <Input placeholder="Enter PAN number" />
            </Form.Item>

            <Form.Item name="broker" label="Broker">
              <Input />
            </Form.Item>

            <Form.Item name="accountType" label="Account Type">
              <Input />
            </Form.Item>

            <Form.Item name="dematAcc" label="Demat Account">
              <Input />
            </Form.Item>

            <Form.Item name="tradingAcc" label="Trading Account">
              <Input />
            </Form.Item>

            <Form.Item name="accountStatus" label="Account Status">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              className="md:col-span-2"
            >
              <Input.TextArea rows={3} placeholder="Your address" />
            </Form.Item>
          </div>

          <Form.Item className="mt-6">
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfilePage;
