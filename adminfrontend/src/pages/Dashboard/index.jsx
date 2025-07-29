
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Row,
  Col,
  Table,
  Input,
  Spin,
  Divider,
  Image,
  Button,
} from "antd";
import {
  UserOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  fetchAllCustomers,
} from "../../redux/Slices/customerSlice";
import {
  fetchAllBalances,
  fetchAllFundRequests,
  fetchAllWithdrawals,
} from "../../redux/Slices/walletSlice";
import { fetchSiteConfig } from "../../redux/Slices/siteConfigSlice";
import DashboardChildFinance from "./DashboardChildFinance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { balances, balanceCount, fundRequests, withdrawals, loadingBalances, loadingFundRequests, loadingWithdrawals } = useSelector((state) => state.wallet);
  const { all: customers, loading: customerLoading } = useSelector((state) => state.customer);
  const { config: siteConfig, loading: siteConfigLoading } = useSelector((state) => state.siteConfig);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredFundData, setFilteredFundData] = useState([]);

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchAllBalances());
    dispatch(fetchAllFundRequests());
    dispatch(fetchAllWithdrawals());
    dispatch(fetchSiteConfig());
    setTimeout(() => setLoading(false), 800);
  }, [dispatch]);

  useEffect(() => {
    const enriched = fundRequests.map((fund) => {
      const customer = customers.find((c) => c.id === fund.customer_id);
      return {
        ...fund,
        full_name: customer?.full_name || "N/A",
        email: customer?.email || "N/A",
      };
    });
    const data = enriched.filter((item) => item.status === "successful").filter(
      (item) =>
        item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.customer_id?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFundData(data);
  }, [fundRequests, customers, search]);

  const totalRevenue = filteredFundData.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalWithdrawals = withdrawals.reduce((sum, item) => sum + (item.status === "completed" ? Number(item.amount) : 0), 0);

  const revenueData = Array.from({ length: 6 }, (_, i) => {
    const month = moment().subtract(i, "months").format("MMM");
    const monthlyRevenue = filteredFundData
      .filter((item) => moment(item.created_at).format("MMM") === month)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return { month, revenue: monthlyRevenue };
  }).reverse();

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (text, record) => (
        <a onClick={() => navigate(`/admin/customer/${record.customer_id}`)} className="text-indigo-800 flex-row hover:underline">
          <div className="cursor-pointer text-gray-800"> {text}</div>
          {record.customer_id}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
      render: (email) => <span className="text-gray-500 text-sm truncate">{email}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span className="text-green-600 font-semibold">₹{Number(amount).toFixed(2)}</span>,
    },

    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      responsive: ["md"],
      render: (date) => (
        <span className="text-gray-600 text-sm">{moment(date).format("DD MMM YYYY, h:mm A")}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${status === "successful" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "UTR",
      dataIndex: "utr_number",
      key: "utr_number",
      render: (utr) => <span className="text-xs text-gray-700">{utr || "N/A"}</span>,
    },

    {
      title: "Screenshot",
      dataIndex: "screenshot",
      key: "screenshot",
      responsive: ["md"],
      render: (src) =>
        src ? (
          <Image
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 6 }}
            src={src}
            alt="screenshot"
            preview={{ mask: "Click to Preview" }}
          />
        ) : (
          <span className="text-gray-400 text-xs">N/A</span>
        ),
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-50">
      {/* <Title level={3} className="text-indigo-700 mb-6">
        Admin Finance Dashboard
      </Title> */}

      {loading ? (
        <div className="text-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <>

          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow-md hover:shadow-lg transition">
                <Link to={"/admin/customers"} title="Cutomers">
                  <div className="flex items-center gap-4">
                    <div className="rounded-b-full bg-gray-50 p-4">

                      <UserOutlined className="!text-blue-600 text-2xl" />
                    </div>
                    <div>
                      <Text className="text-gray-500">Total Customers</Text>
                      <Title level={4} className="!text-gray-800 m-0 ">{customers.length}</Title>
                    </div>
                  </div></Link>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow-md hover:shadow-lg transition">
                <Link to={"/admin/all-wallet"} title="all-wallet">

                  <div className="flex items-center gap-4">
                    <div className="rounded-b-full bg-gray-50 p-4">
                      <ArrowDownOutlined className="!text-green-600 text-2xl" />
                    </div>
                    <div>
                      <Text className="!text-gray-500">Fund Deposits</Text>
                      <Title level={4} className="!text-gray-800 m-0">₹{totalRevenue.toLocaleString()}</Title>
                    </div>
                  </div>
                </Link>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow-md hover:shadow-lg transition">
                <Link to={"/admin/withdrawal"} title="All Withdrawal">
                  <div className="flex items-center gap-4">
                    <div className="rounded-b-full bg-gray-50 p-4">
                      <ArrowUpOutlined className="!text-red-600 text-2xl" />
                    </div>
                    <div>
                      <Text className="!text-gray-500">Withdrawals</Text>
                      <Title level={4} className="!text-gray-800 m-0">₹{totalWithdrawals.toLocaleString()}</Title>
                    </div>
                  </div>
                </Link>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow-md hover:shadow-lg transition">
                <Link to={"/admin/all-wallet"} title="all-wallet">
                  <div className="flex items-center gap-4">
                    <div className="rounded-b-full bg-gray-50 p-4">

                      <WalletOutlined className="!text-purple-600 text-2xl" />
                    </div>
                    <div>
                      <Text className="!text-gray-500">Wallets Active</Text>
                      {console.log(balances?.length ?? 'N/A', balanceCount ?? 'N/A')}
                      <Title level={4} className="!text-gray-800 m-0">
                        {(Array.isArray(balances) ? balances.length : balanceCount ?? 0)}
                      </Title>
                    </div>

                  </div>
                </Link>
              </Card>
            </Col>
          </Row>

          <DashboardChildFinance />

          <Row gutter={[16, 16]} className="mb-6">
            <Col span={24}>
              <Card title="Monthly Revenue Overview" className="shadow-md">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#1890ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <Title level={4} className="text-gray-700 m-0">
                Recent Fund Transactions
              </Title>
              <div className="flex gap-4">
                <Button type="link" onClick={() => navigate("/admin/fund-requests")}>
                  View All Fund Requests
                </Button>
                <Input.Search
                  placeholder="Search by name, email, or ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-72"
                  allowClear
                />
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredFundData}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              scroll={{ x: true }}
              bordered
            />
          </Card>
          <div className="saturate-100 shadow-2xl ">
            {siteConfig && (
              <Card className="mb-6 shadow-md">
                <Text strong>Fund Deposit Instructions</Text>
                <Divider />
                <p>Send funds to: <strong>{siteConfig.upi_id || "Not set"}</strong></p>
                {siteConfig.qr_image_url && (
                  <Image
                    src={siteConfig.qr_image_url}
                    alt="UPI QR Code"
                    width={100}
                    height={100}
                    className="mt-2"
                  />
                )}
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;