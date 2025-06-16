import React, { useEffect, useState } from "react";
import {
  Table,
  DatePicker,
  Input,
  Spin,
  Empty,
  Pagination,
  Select,
} from "antd";
import {
  FaMoneyBillWave,
  FaWallet,
  FaArrowCircleUp,
  FaArrowCircleDown,
} from "react-icons/fa";
import {
  MdPendingActions,
  MdCancel,
  MdCheckCircle,
  MdError,
} from "react-icons/md";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardCard = ({ icon, value, label, color }) => (
  <div className="flex items-center p-4 space-x-4 shadow rounded-lg bg-white hover:bg-gray-100 transition">
    <div className={`p-3 rounded-full text-white bg-${color}-500`}>{icon}</div>
    <div className="flex flex-col">
      <p className="text-xl font-bold">{value || "0"}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  </div>
);

const mockData = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  userId: `USR${1000 + i}`,
  amount: Math.floor(Math.random() * 2000 + 100),
  date: dayjs().subtract(i, "day").format("YYYY-MM-DD HH:mm:ss"),
  type: i % 2 === 0 ? "deposit" : "withdrawal",
  status: ["pending", "approved", "cancelled", "failed"][i % 4],
  brokerCharge: Math.floor(Math.random() * 100),
}));

const WalletPage = () => {
  const [walletData, setWalletData] = useState({
    addFund: 2000,
    winning: 1500,
    loss: 500,
    withdrawal: 800,
  });

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockData);
      setFiltered(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (search) {
      result = result.filter((item) =>
        item.userId.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (dateRange) {
      const [start, end] = dateRange;
      result = result.filter((item) => {
        const date = dayjs(item.date);
        return date.isAfter(start) && date.isBefore(end);
      });
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [search, dateRange, statusFilter, transactions]);

  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 120,
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amt) => <b className="text-green-700">₹{amt}</b>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (t) => (
        <span
          className={`capitalize flex items-center gap-1 ${
            t === "deposit" ? "text-blue-600" : "text-purple-600"
          }`}
        >
          {t === "deposit" ? <FaMoneyBillWave /> : <FaArrowCircleUp />} {t}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => {
        const config = {
          pending: { icon: <MdPendingActions />, color: "text-yellow-600" },
          approved: { icon: <MdCheckCircle />, color: "text-green-600" },
          cancelled: { icon: <MdCancel />, color: "text-red-600" },
          failed: { icon: <MdError />, color: "text-orange-500" },
        }[status];

        return (
          <span
            className={`capitalize font-medium flex items-center gap-1 ${config.color}`}
          >
            {config.icon} {status}
          </span>
        );
      },
    },
    {
      title: "Broker Charge",
      dataIndex: "brokerCharge",
      key: "brokerCharge",
      width: 120,
      render: (fee) => `₹${fee}`,
    },
    {
      title: "Date/Time",
      dataIndex: "date",
      key: "date",
      width: 180,
      render: (d) => (
        <span className="text-gray-500">
          {dayjs(d).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-6  overflow-x-auto">
      <h1 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-400 inline-block pb-1">
        <div className="mb-2 text-xl font-semibold text-indigo-700">
          🔁 Recent Wallet Transactions
        </div>
      </h1>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
        <DashboardCard
          icon={<FaMoneyBillWave size={24} />}
          value={`₹${walletData.addFund}`}
          label="Add Fund"
          color="green"
        />
        <DashboardCard
          icon={<FaWallet size={24} />}
          value={`₹${walletData.winning}`}
          label="Winning Amount"
          color="blue"
        />
        <DashboardCard
          icon={<FaArrowCircleDown size={24} />}
          value={`₹${walletData.loss}`}
          label="Loss Amount"
          color="red"
        />
        <DashboardCard
          icon={<FaArrowCircleUp size={24} />}
          value={`₹${walletData.withdrawal}`}
          label="Withdrawal"
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
        <Input.Search
          placeholder="🔍 Search User ID"
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
          allowClear
        />
        <RangePicker
          className="w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
          onChange={(dates) => setDateRange(dates)}
        />
        <Select
          defaultValue="all"
          className="w-full rounded-md shadow-sm"
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="all">All</Option>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="cancelled">Cancelled</Option>
          <Option value="failed">Failed</Option>
        </Select>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {loading ? (
          <Spin size="large" />
        ) : filtered.length === 0 ? (
          <Empty description="No transactions found" />
        ) : (
          filtered.map((txn) => {
            const typeColor =
              txn.type === "deposit" ? "text-blue-600" : "text-purple-600";
            const typeIcon =
              txn.type === "deposit" ? (
                <FaMoneyBillWave />
              ) : (
                <FaArrowCircleUp />
              );

            const statusMap = {
              pending: {
                color: "text-yellow-600",
                icon: <MdPendingActions />,
              },
              approved: {
                color: "text-green-600",
                icon: <MdCheckCircle />,
              },
              cancelled: {
                color: "text-red-600",
                icon: <MdCancel />,
              },
              failed: {
                color: "text-orange-500",
                icon: <MdError />,
              },
            };

            const { icon: statusIcon, color: statusColor } =
              statusMap[txn.status] || {};

            return (
              <div
                key={txn.id}
                className="bg-white rounded-lg shadow-md mb-4 p-4 border-l-4 border-indigo-500"
              >
                <div className="mb-2 flex justify-between">
                  <span className="font-semibold text-gray-700">User ID:</span>
                  <span className="text-indigo-700">{txn.userId}</span>
                </div>

                <div className="mb-2 flex justify-between">
                  <span className="font-semibold text-gray-700">Amount:</span>
                  <span className="font-bold text-green-600">
                    ₹{txn.amount}
                  </span>
                </div>

                <div className="mb-2 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Type:</span>
                  <span
                    className={`capitalize flex items-center gap-1 ${typeColor}`}
                  >
                    {typeIcon} {txn.type}
                  </span>
                </div>

                <div className="mb-2 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span
                    className={`capitalize flex items-center gap-1 ${statusColor}`}
                  >
                    {statusIcon} {txn.status}
                  </span>
                </div>

                <div className="mb-2 flex justify-between">
                  <span className="font-semibold text-gray-700">
                    Broker Charge:
                  </span>
                  <span className="text-gray-700">₹{txn.brokerCharge}</span>
                </div>

                <div className="mb-1 flex justify-between">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span className="text-gray-500">
                    {dayjs(txn.date).format("YYYY-MM-DD HH:mm")}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {loading ? (
              <Spin size="large" />
            ) : filtered.length === 0 ? (
              <Empty description="No transactions found" />
            ) : (
              <>
                <Table
                  dataSource={filtered.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                  )}
                  columns={columns}
                  pagination={false}
                  rowKey="id"
                  bordered
                  rowClassName={(record, index) =>
                    `hover:bg-indigo-50 transition duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`
                  }
                />

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * pageSize + 1,
                      filtered.length
                    )}{" "}
                    - {Math.min(currentPage * pageSize, filtered.length)} of{" "}
                    {filtered.length}
                  </span>
                  <Pagination
                    current={currentPage}
                    total={filtered.length}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm italic text-center text-gray-600 mt-8 bg-gray-50 p-2 rounded-md">
        * Note: Broker charges are automatically deducted from each transaction.
      </div>
    </div>
  );
};

export default WalletPage;
