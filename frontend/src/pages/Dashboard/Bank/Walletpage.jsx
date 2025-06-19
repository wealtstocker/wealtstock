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

import dayjs from "dayjs";
import axiosInstance from "../../../api/axiosInstance";
import toast from "../../Services/toast";

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

const WalletPage = () => {
  const [walletData, setWalletData] = useState({
    addFund: 0,
    winning: 0,
    loss: 0,
    withdrawal: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchWalletHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/wallet/wallet-history");
      const data = res.data.data;

      setTransactions(data);
      setFiltered(data);
      calculateSummary(data);
    } catch (err) {
      console.error("Failed to load wallet:", err);
      toast.error("Failed to load wallet history.");
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    let addFund = 0,
      winning = 0,
      loss = 0,
      withdrawal = 0;

    data.forEach((t) => {
      if (t.transaction_type === "deposit") addFund += Number(t.amount);
      if (t.transaction_type === "winning") winning += Number(t.amount);
      if (t.transaction_type === "loss") loss += Number(t.amount);
      if (t.transaction_type === "withdrawal") withdrawal += Number(t.amount);
    });

    setWalletData({ addFund, winning, loss, withdrawal });
  };

  useEffect(() => {
    fetchWalletHistory();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (search) {
      result = result.filter((item) =>
        (item.user_id || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (dateRange) {
      const [start, end] = dateRange;
      result = result.filter((item) => {
        const date = dayjs(item.created_at);
        return date.isAfter(start) && date.isBefore(end);
      });
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [search, dateRange, statusFilter, transactions]);
  const columns = [
    {
      title: "Txn ID",
      dataIndex: "id",
      key: "id",
      width: 100,
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
          className={`capitalize flex items-center gap-1 ${t === "credit" ? "text-blue-600" : "text-purple-600"
            }`}
        >
          {t === "credit" ? <FaMoneyBillWave /> : <FaArrowCircleUp />} {t}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 120,
      render: (bal) => `₹${bal}`,
    },
    {
      title: "Date/Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (d) => (
        <span className="text-gray-500">
          {dayjs(d).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-6 overflow-x-auto">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input.Search
          placeholder="🔍 Search by Txn ID"
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md shadow-sm"
          allowClear
        />
        <RangePicker
          className="w-full"
          onChange={(dates) => setDateRange(dates)}
        />
        <Select
          defaultValue="all"
          className="w-full"
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="all">All</Option>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="cancelled">Cancelled</Option>
          <Option value="failed">Failed</Option>
        </Select>
      </div>

      <div className="hidden sm:block">
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
            />
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Showing{" "}
                {Math.min((currentPage - 1) * pageSize + 1, filtered.length)} -{" "}
                {Math.min(currentPage * pageSize, filtered.length)} of{" "}
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

      <div className="text-sm italic text-center text-gray-600 mt-8 bg-gray-50 p-2 rounded-md">
        * Note: Broker charges are automatically deducted from each transaction.
      </div>
    </div>
  );
};

export default WalletPage;
