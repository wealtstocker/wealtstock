import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Card,
} from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import axiosInstance from "../lib/axiosInstance";

const { Title, Text } = Typography;

const AdminRegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const res = await axiosInstance.post("auth/admin/register", {
        ...values,
        role: "admin",
      });
console.log(res)
      toast.success("🎉 Admin registered successfully!", {
        position: "top-right",
      });

      navigate("/");
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed!";
      toast.error(`❌ ${msg}`, { position: "top-right" });
      console.error("Registration Error:", error);
    }
  };

  const validatePassword = (_, value) => {
    if (value && value !== form.getFieldValue("password")) {
      return Promise.reject("Passwords do not match!");
    }
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-md rounded-xl">
        <Title level={3} className="text-center text-blue-600">Admin Registration</Title>
        <Text className="text-center block mb-6 text-gray-500">
          Register a new admin account to manage the platform
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Full Name"
                name="full_name"
                rules={[{ required: true, message: "Full name is required" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Rohit Patel"
                  className="rounded"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="admin@example.com"
                  className="rounded"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Phone Number"
                name="phone_number"
                rules={[
                  { required: true, message: "Phone number is required" },
                  { min: 10, message: "Enter a valid phone number" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="9876543210"
                  className="rounded"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="rounded"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Confirm Password"
                name="confirm_password"
                dependencies={['password']}
                rules={[
                  { required: true, message: "Confirm your password" },
                  { validator: validatePassword },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  className="rounded"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item className="text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  size="large"
                >
                  Register Admin
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AdminRegisterPage;
