import React from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Modal,
} from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import ProfilePage from "./Profile";
import toast from "../../Services/toast";
import axiosInstance from "../../../api/axiosInstance";

const { TabPane } = Tabs;

const SettingsPage = () => {
  const [form] = Form.useForm();

  // ✅ Handle Password Change
  const handlePasswordChange = async (values) => {
    try {
      const res = await axiosInstance.post("/auth/change-password", values);
      console.log("res",res)
      toast.success(res.data.message || "Password changed successfully");
      form.resetFields();
    } catch (err) {
      console.error("axios", err)
      toast.error(err.response?.data?.message || "Password update failed");
    }
  };

  // ✅ Handle Account Deactivation
  const handleDeactivate = () => {
    Modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "This will deactivate your account. You will be logged out.",
      okText: "Yes, Deactivate",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const customerId = localStorage.getItem("customer_id"); // or from Redux
          await axiosInstance.delete(`/customer/${customerId}`);
          toast.success("Account deactivated successfully");
          localStorage.clear();
          window.location.href = "/login";
        } catch (err) {
          toast.error(err.response?.data?.message || "Account deactivation failed");
        }
      },
    });
  };

  return (
    <div className="p-2 max-w-7xl mx-auto bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        ⚙️ Account Settings
      </h2>

      <Tabs defaultActiveKey="1">
        {/* 🔹 Profile Tab */}
        <TabPane tab="Profile" key="1">
          <ProfilePage />
        </TabPane>

        {/* 🔒 Password Change Tab */}
        <TabPane tab="Password" key="2">
          <Form layout="vertical" form={form} onFinish={handlePasswordChange}>
            <Form.Item
              label="Current Password"
              name="current_password"
              rules={[{ required: true, message: "Current password is required" }]}
            >
              <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="new_password"
              rules={[{ required: true, message: "New password is required" }]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirm_password"
              dependencies={["new_password"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* 🔻 Danger Zone Tab */}
        <TabPane tab="Security" key="3">
          <div className="bg-red-50 border border-red-300 rounded p-4 space-y-3">
            <h3 className="text-red-700 font-semibold">⚠️ Danger Zone</h3>
            <p>
              Deactivating your account will log you out and restrict access until reactivated by admin.
            </p>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeactivate}
            >
              Deactivate My Account
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SettingsPage;