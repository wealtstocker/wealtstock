import React, { useState, useEffect } from 'react';
import { Input, Form, Button, Upload, Avatar } from 'antd';
import { UserOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
// import { message } from 'antd';
const EditProfilePage = ({ userData, onClose }) => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue(userData);
    }
  }, [userData, form]);

  const handleAvatarChange = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target.result);
    reader.readAsDataURL(file.originFileObj);
  };

  const handleFormSubmit = (values) => {
    console.log('Updated profile:', values);
    // Perform API call here
    // message.success('Profile updated successfully!');
    if (onClose) onClose(); // Close edit mode
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-blue-600 hover:underline text-sm flex items-center">
            <ArrowLeftOutlined className="mr-1" /> Back
          </button>
        </div>

        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>

          <Form.Item label="Avatar" className="text-center">
            <Upload showUploadList={false} onChange={handleAvatarChange}>
              <Avatar
                size={80}
                src={avatar}
                icon={<UserOutlined />}
                className="cursor-pointer shadow-md mx-auto border"
              />
              <div className="text-xs text-gray-500 mt-1">Click to change</div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="+91 9876543210" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea placeholder="Your address" rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="mt-2">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfilePage;
