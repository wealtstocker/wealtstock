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
import {
  fetchAllWithdrawals,
  updateWithdrawalStatus,
} from "../../../redux/Slices/withdrawalSlice";
import Toast from "../../../services/toast";

const { Title } = Typography;
const { Option } = Select;

const AdminWithdrawalList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.withdrawals);

  const [filterStatus, setFilterStatus] = useState("requested");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllWithdrawals(filterStatus));
  }, [dispatch, filterStatus]);

  const handleApprove = async (record) => {
    try {
      await dispatch(
        updateWithdrawalStatus({ withdrawal_id: record.withdrawal_id, action: "approve" })
      ).unwrap();
      Toast.success("✅ Withdrawal approved");
    } catch (err) {
      Toast.error(err);
    }
  };

  const handleReject = async (record) => {
    try {
      await dispatch(
        updateWithdrawalStatus({ withdrawal_id: record.withdrawal_id, action: "reject" })
      ).unwrap();
      Toast.success("❌ Withdrawal rejected");
    } catch (err) {
      Toast.error(err);
    }
  };

  const filteredData = list.filter((item) =>
    item.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
    }

    return <Tag icon={icon} color={color}>{status.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "customer_id",
      key: "customer_id",
      responsive: ["md"],
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => (
        <span>
          <UserOutlined className="mr-1" />
          {text}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <span>
          <MailOutlined className="mr-1" />
          {text}
        </span>
      ),
      responsive: ["md"],
    },
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
      title: "Action",
      key: "actions",
      render: (_, record) =>
        record.status === "requested" ? (
          <Space>
            <Popconfirm
              title="Are you sure to approve this withdrawal?"
              onConfirm={() => handleApprove(record)}
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
              onConfirm={() => handleReject(record)}
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
          <Tag color={record.status === "completed" ? "green" : "red"}>
            {record.status.toUpperCase()}
          </Tag>
        ),
    },
  ];

  return (
    <div className="p-4 w-full ">
      <Title level={3}>💸 Admin – Withdrawal Management</Title>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <Input
          placeholder="🔍 Search by name"
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
        scroll={{ x: true }}
        bordered
      />
    </div>
  );
};

export default AdminWithdrawalList;
