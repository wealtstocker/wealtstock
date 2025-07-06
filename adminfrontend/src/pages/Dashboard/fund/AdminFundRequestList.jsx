import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Spin, Input, Select, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  approveFundRequest,
  fetchFundRequests,
} from "../../../redux/Slices/fundSlice";
import { fetchAllCustomers } from "../../../redux/Slices/customerSlice";
import Toast from "../../../services/toast";

const AdminFundRequestList = () => {
  const dispatch = useDispatch();

  const { fundRequests, loading } = useSelector((state) => state.fund);
  const { all: customers, loading: customerLoading } = useSelector(
    (state) => state.customer
  );
  console.log(fundRequests)

  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchFundRequests());
  }, [dispatch]);
  // console.log(customers)
  useEffect(() => {
    filterData();
  }, [fundRequests, customers, search, statusFilter]);

  const filterData = () => {
    let data = fundRequests.map((fund) => {
      const customer = customers.find((c) => c.id === fund.customer_id);
      return {
        ...fund,
        full_name: customer?.full_name || "N/A",
        email: customer?.email || "N/A",
      };
    });
    data = data.filter((item) => item.status === "pending");

    if (search) {
      data = data.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(data);
  };

  const handleApprove = async (id) => {
    try {
      await dispatch(approveFundRequest(id)).unwrap();
      Toast.success("✅ Fund approved successfully");
      dispatch(fetchFundRequests()); // Refresh after approval
    } catch (err) {
      Toast.error("❌ Failed to approve fund");
    }
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "full_name",
      sorter: (a, b) => a.full_name?.localeCompare(b.full_name),
      render: (name) => name || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => email || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
      render: (amount) => `₹${parseFloat(amount).toLocaleString()}`,
    },
    {
      title: "UTR Number",
      dataIndex: "utr_number",
      render: (utr) => utr || "N/A",
    },
    // {
    //   title: 'Screenshot',
    //   dataIndex: 'screenshot',
    //   render: (src) =>
    //     src ? (
    //       <a href={`/${src}`} target="_blank" rel="noreferrer">
    //         <img src={`/${src}`}  crossOrigin="anonymous" alt="screenshot" width={50} height={50} />
    //       </a>
    //     ) : (
    //       'N/A'
    //     ),
    // },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Successful", value: "successful" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === "successful" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
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
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record.id)}
          >
            Approve
          </Button>
        ) : (
          <Tag color="green">Approved</Tag>
        ),
    },
  ];

  return (
    <div className="p-2 sm:p-6 bg-white rounded-md shadow-md overflow-x-auto">
      <h2 className="text-xl font-bold mb-6 text-indigo-700">
        📄 All Fund Requests
      </h2>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Input
          placeholder="🔍 Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
          allowClear
        />
      </div>

      {/* Table or Loading */}
      {loading || customerLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 900 }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminFundRequestList;
