import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Select,
  Input,
  Popconfirm,
  Space,
  Typography,
  Tooltip,
  Empty,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllWithdrawals } from "../../../redux/Slices/withdrawalSlice";
import { updateWithdrawalStatus } from "../../../redux/Slices/walletSlice";
import Toast from "../../../services/toast";

const { Title } = Typography;
const { Option } = Select;

const AdminWithdrawalList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.withdrawals);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllWithdrawals());
  }, [dispatch]);

  const handleWithdrawalAction = async (withdrawalId, action) => {
    try {
      await dispatch(updateWithdrawalStatus({ withdrawal_id: withdrawalId, action })).unwrap();
      // Toast.success(`✅ Withdrawal ${action}d`);
      dispatch(fetchAllWithdrawals());
    } catch (err) {
      console.error(err);
      Toast.error(err?.message || `❌ Failed to ${action} withdrawal`);
    }
  };

  const handleViewCustomer = (customerId) => {
    navigate(`/admin/customer/${customerId}`);
  };

  const filteredData = list
    .filter((item) =>
      item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      !filterStatus || item.status === filterStatus
    );

  const statusTag = (status) => {
    let color = "default";
    let icon = null;

    switch (status) {
      case "completed":
        color = "green";
        icon = <CheckCircleOutlined />;
        break;
      case "rejected":
        color = "red";
        icon = <CloseCircleOutlined />;
        break;
      case "requested":
        color = "orange";
        icon = <ClockCircleOutlined />;
        break;
      default:
        color = "default";
    }

    return <Tag icon={icon} color={color}>{status.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "customer_id",
      key: "customer_id",
      render: (text) => (
        <Tooltip title="View Customer Details">
          <a onClick={() => handleViewCustomer(text)} className="text-indigo-600 hover:underline">
            {text}
          </a>
        </Tooltip>
      ),
      responsive: ["md"],
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => (
        <span >
          <UserOutlined className="mr-1" />
          {text || '-'}
        </span>
      ),
    },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    //   render: (text) => (
    //     <span>
    //       <MailOutlined className="mr-1" />
    //       {text || '-'}
    //     </span>
    //   ),
    //   responsive: ["md"],
    // },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val) => <strong>₹{Number(val).toFixed(2)}</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => statusTag(status),
    },
    {
      title: "Requested At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "requested" ? (
          <Space size="small">
            <Popconfirm
              title="Are you sure to approve this withdrawal?"
              onConfirm={() => handleWithdrawalAction(record.withdrawal_id, "approve")}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Approve Request">
                <Button type="primary" size="small">
                  Approve
                </Button>
              </Tooltip>
            </Popconfirm>
            <Popconfirm
              title="Are you sure to reject this withdrawal?"
              onConfirm={() => handleWithdrawalAction(record.withdrawal_id, "reject")}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Reject Request">
                <Button danger size="small">
                  Reject
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        ) : (
          statusTag(record.status)
        ),
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Title level={3} className="text-indigo-700 mb-6">
        💸 Withdrawal Management
      </Title>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <Input
          placeholder="🔍 Search by name, email, or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
          allowClear
        />
        <Select
          placeholder="📊 Filter by status"
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
          allowClear
          className="w-full md:w-1/4"
        >
          <Option value="">All</Option>
          <Option value="requested">Requested</Option>
          <Option value="completed">Completed</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="withdrawal_id"
        loading={loading}
        locale={{ emptyText: <Empty description="No withdrawals found" /> }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        rowClassName="cursor-pointer hover:bg-gray-50"

        scroll={{ x: 'max-content' }}
        bordered
      />
    </div>
  );
};

export default AdminWithdrawalList;
