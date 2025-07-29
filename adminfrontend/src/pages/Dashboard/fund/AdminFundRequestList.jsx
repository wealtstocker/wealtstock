// ✅ AdminFundRequestList.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Spin,
  Input,
  Modal,
  Form,
  InputNumber,
  Image,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  fetchFundRequests,
  setFundRequestApproved,
  setFundRequestRejected,
} from "../../../redux/Slices/fundSlice";
import { fetchAllCustomers } from "../../../redux/Slices/customerSlice";
import Toast from "../../../services/toast";
import axiosInstance from "../../../lib/axiosInstance";

const AdminFundRequestList = () => {
  const dispatch = useDispatch();
  const { fundRequests, loading } = useSelector((state) => state.fund);
  const { all: customers, loading: customerLoading } = useSelector(
    (state) => state.customer
  );

  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFund, setSelectedFund] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectingFund, setRejectingFund] = useState(null);
  const [amountForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchFundRequests());
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [fundRequests, customers, search]);

  const filterData = () => {
    let data = fundRequests.map((fund) => {
      const customer = customers.find((c) => c.id === fund.customer_id);
      return {
        ...fund,
        full_name: customer?.full_name || "N/A",
        email: customer?.email || "N/A",
      };
    });

    if (search) {
      data = data.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(data);
  };

  const openApproveModal = (record) => {
    setSelectedFund(record);
    amountForm.setFieldsValue({ amount: parseFloat(record.amount) });
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await amountForm.validateFields();
      const { amount } = values;
      const res = await axiosInstance.post(
        `/wallet/approve-fund-request/${selectedFund.id}`,
        { amount }
      );
      console.log(res)
      // Toast.success("✅ Fund approved successfully");
      setModalVisible(false);
      dispatch(setFundRequestApproved(selectedFund.id));
    } catch (err) {
      Toast.error("❌ Approval failed. Try again.");
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstance.post(`/wallet/reject-fund-request/${rejectingFund.id}`);
      Toast.success("❌ Fund rejected successfully");
      dispatch(setFundRequestRejected(rejectingFund.id));
      setRejectModalVisible(false);
    } catch (err) {
      Toast.error("Failed to reject. Try again.");
    }
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "full_name",
      render: (name) => name || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `₹${parseFloat(amount).toLocaleString()}`,
    },
    {
      title: "UTR Number",
      dataIndex: "utr_number",
      render: (utr) => utr || "N/A",
    },
    {
      title: "Screenshot",
      dataIndex: "screenshot",
      render: (src) =>
        src ? (
          <Image
            src={src}
            alt="Payment Screenshot"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8, maxWidth: "100%" }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "successful" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (date) =>
        new Date(date).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Actions",
      render: (_, record) =>
        record.status !== "successful" ? (
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => openApproveModal(record)}
            >
              Approve
            </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setRejectingFund(record);
                setRejectModalVisible(true);
              }}
            >
              Reject
            </Button>
          </div>
        ) : (
          <Tag color="green">Approved</Tag>
        ),
    },
  ];

  return (
    <div className="p-3 sm:p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">
        📅 Pending Fund Requests
      </h2>

      <Input
        placeholder="🔍 Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full sm:w-1/2"
        allowClear
      />

      {loading || customerLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredData.filter((item) => item.status === "pending")}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        title="Approve Fund Request"
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Approve"
        confirmLoading={loading}
        centered
      >
        <Form form={amountForm} layout="vertical">
          <Form.Item
            label="Amount to Approve"
            name="amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Enter approved amount"
              prefix="₹"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Fund Request"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="Reject"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Are you sure you want to reject this fund request?</p>
      </Modal>
    </div>
  );
};

export default AdminFundRequestList;
