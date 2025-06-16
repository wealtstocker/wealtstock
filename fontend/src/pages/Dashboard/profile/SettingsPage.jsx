import React from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Avatar,
  Upload,
  message,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ProfilePage from "./Profile";

const { TabPane } = Tabs;

const SettingsPage = () => {
  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  return (
    <div className="p-2 max-w-7xl mx-auto bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        ⚙️ Account Settings
      </h2>

      <Tabs defaultActiveKey="1">
        {/* Profile Settings */}
        <TabPane tab="Profile" key="1">
          <ProfilePage />
        </TabPane>

        {/* Password Settings */}
        <TabPane tab="Password" key="2">
          <Form layout="vertical">
            <Form.Item label="Current Password">
              <Input.Password placeholder="Current password" />
            </Form.Item>
            <Form.Item label="New Password">
              <Input.Password placeholder="New password" />
            </Form.Item>
            <Form.Item label="Confirm New Password">
              <Input.Password placeholder="Confirm password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary">Change Password</Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* Preferences */}
        <TabPane tab="Preferences" key="3">
          <Form layout="vertical">
            <Form.Item label="Dark Mode">
              <Switch />
            </Form.Item>
            <Form.Item label="Notifications">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="Language">
              <Input placeholder="e.g., English, Hindi" />
            </Form.Item>
            <Form.Item>
              <Button type="primary">Save Preferences</Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* Danger Zone */}
        <TabPane tab="Security" key="4">
          <div className="bg-red-50 border border-red-300 rounded p-4 space-y-3">
            <h3 className="text-red-700 font-semibold">⚠️ Danger Zone</h3>
            <p>Deleting your account is permanent and cannot be undone.</p>
            <Button danger icon={<DeleteOutlined />}>
              Delete My Account
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
