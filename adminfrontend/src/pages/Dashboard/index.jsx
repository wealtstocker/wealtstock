import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "antd";
import {
  UserOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { fetchAllCustomers } from "../../redux/Slices/customerSlice";
import { fetchFundRequests } from "../../redux/Slices/fundSlice";
import { fetchAllBalances } from "../../redux/Slices/balanceSlice";
import { fetchAllWithdrawals } from "../../redux/Slices/withdrawalSlice";
import DashboardChildFinance from "./DashboardChildFinance";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
 import moment from "moment";

const { Title } = Typography;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { balances } = useSelector((state) => state.balance);
  const { all: customers } = useSelector((state) => state.customer);
  const { fundRequests } = useSelector((state) => state.fund);
  const { list: withdrawals } = useSelector((state) => state.withdrawals);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredFundData, setFilteredFundData] = useState([]);

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchAllBalances());
    dispatch(fetchFundRequests());
    dispatch(fetchAllWithdrawals());
    setTimeout(() => setLoading(false), 800);
  }, [dispatch]);

  useEffect(() => {
    filterFundData();
  }, [fundRequests, customers, search]);

  const filterFundData = () => {
    let data = fundRequests.map((fund) => {
      const customer = customers.find((c) => c.id === fund.customer_id);
      return {
        ...fund,
        full_name: customer?.full_name || "N/A",
        email: customer?.email || "N/A",
      };
    });
    data = data.filter((item) => item.status === "successful");
    if (search) {
      data = data.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredFundData(data);
  };

  const totalRevenue = filteredFundData.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalWithdrawals = withdrawals.reduce((sum, item) => sum + (item.status === "completed" ? Number(item.amount) : 0), 0);

  const chartData = filteredFundData.slice(0, 10).map((item, idx) => ({
    name: `Txn ${idx + 1}`,
    amount: Number(item.amount)
  }));


const columns = [
  {
    title: "Customer Name",
    dataIndex: "full_name",
    key: "full_name",
    responsive: ["xs", "sm", "md", "lg"],
    render: (text) => <span className="font-medium text-gray-800">{text}</span>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    responsive: ["md"],
    render: (email) => (
      <span className="text-gray-500 text-sm truncate">{email}</span>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => (
      <span className="text-green-600 font-semibold">₹{Number(amount).toFixed(2)}</span>
    ),
  },
  {
    title: "Mode",
    dataIndex: "method", // change to `method` if your actual data uses that key
    key: "method",
    render: (mode) => (
      <span className="capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded">
        {mode}
      </span>
    ),
  },
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
    render: (date) => (
      <span className="text-gray-600 text-sm">
        {moment(date).format("DD MMM YYYY, h:mm A")}
      </span>
    ),
  },
  {
  title: "Status",
  dataIndex: "status",
  key: "status",
  render: (status) => (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        status === "successful"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-800"
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
  render: (utr) => <span className="text-xs text-gray-700">{utr}</span>,
},
{
  title: "Note",
  dataIndex: "note",
  key: "note",
  responsive: ["lg"],
  render: (note) =>
    note.length > 30 ? (
      <span className="text-xs text-gray-600">{note.slice(0, 30)}...</span>
    ) : (
      <span className="text-xs text-gray-600">{note}</span>
    ),
},
// {
//   title: "Screenshot",
//   dataIndex: "screenshot",
//   key: "screenshot",
//   responsive: ["md"],
//   render: (src) =>
//     src ? (
//       <Image
//         width={60}
//         height={60}
//         style={{ objectFit: "cover", borderRadius: 6 }}
//         src={`/${src}`} // Adjust based on your actual static/media path setup
//         alt="screenshot"
//         preview={{ mask: "Click to Preview" }}
//       />
//     ) : (
//       <span className="text-gray-400 text-xs">N/A</span>
//     ),
// },

];

  const revenueData = [
    { month: "Jan", revenue: 120000 },
    { month: "Feb", revenue: 140000 },
    { month: "Mar", revenue: 180000 },
    { month: "Apr", revenue: 170000 },
    { month: "May", revenue: 220000 },
    { month: "Jun", revenue: 260000 },
  ];

  return (
    <div className="md:p-6 p-1 min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
      {/* <Title level={2} className=" mb-6">
        Admin Finance Dashboard
      </Title> */}

      {loading ? (
        <div className="text-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} className="mb-8">
            {/* Total Customers */}
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="shadow-xl rounded-xl hover:shadow-2xl transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 text-xl">
                    <UserOutlined />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {customers.length}
                    </h2>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Fund Deposits */}
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="shadow-xl rounded-xl hover:shadow-2xl transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 text-xl">
                    <ArrowDownOutlined />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fund Deposits</p>
                    <h2 className="text-xl font-semibold text-gray-800">
                      ₹{totalRevenue.toLocaleString()}
                    </h2>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Withdrawals */}
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="shadow-xl rounded-xl hover:shadow-2xl transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 text-xl">
                    <ArrowUpOutlined />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Withdrawals</p>
                    <h2 className="text-xl font-semibold text-gray-800">
                      ₹{totalWithdrawals.toLocaleString()}
                    </h2>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Wallets Active */}
            <Col xs={24} sm={12} md={6}>
              <Card
                bordered={false}
                className="shadow-xl rounded-xl hover:shadow-2xl transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 text-xl">
                    <WalletOutlined />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wallets Active</p>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {balances.length}
                    </h2>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>



            <DashboardChildFinance />
          <div className=" ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-3">
              <Row gutter={[24, 24]} className="">
                <Col span={24}>
                  <Card title="Fund Transaction Graph" bordered={false} className="shadow-md">
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={chartData}>
                        <Line type="monotone" dataKey="amount" stroke="#1890ff" strokeWidth={2} />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
              {/* Revenue Chart */}
              <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Monthly Revenue Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>


         {/* Recent Fund Transactions Table */}
<div className="bg-white p-4 rounded-xl shadow-md w-full overflow-hidden">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
    <h2 className="text-lg font-semibold text-gray-700">
      Recent Fund Transactions
    </h2>
    <Input.Search
      placeholder="Search by name or email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full md:w-72"
      allowClear
    />
  </div>

  <div className="overflow-x-auto">
    <Table
      columns={columns}
      dataSource={filteredFundData}
      pagination={{ pageSize: 5 }}
      rowKey={(record) => record.id}
      scroll={{ x: "max-content" }} // important for small screens
    />
  </div>
</div>
{console.log("filteredFundData",filteredFundData)}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;