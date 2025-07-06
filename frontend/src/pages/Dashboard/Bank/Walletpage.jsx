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
  title: "S.No",
  key: "serial",
  width: 80,
  render: (_text, _record, index) =>
    filtered.length - ((currentPage - 1) * pageSize + index),
},
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amt, record) => (
        <b className={record.type === "credit" ? "text-green-700" : "text-red-500"}>
          ₹{parseFloat(amt).toFixed(2)}
        </b>
      ),
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white min-h-screen overflow-x-auto">

      {/* 🔍 Filter Controls (Search | Date | Status) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Input.Search
          placeholder="🔍 Search by Txn ID"
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md shadow-sm"
          allowClear
          size="large"
        />

        <RangePicker
          className="w-full"
          onChange={(dates) => setDateRange(dates)}
          size="large"
        />

        <Select
          defaultValue="all"
          className="w-full"
          onChange={(value) => setStatusFilter(value)}
          size="large"
        >
          <Option value="all">All</Option>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="cancelled">Cancelled</Option>
          <Option value="failed">Failed</Option>
        </Select>
      </div>

      {/* 📄 Table Section */}
      <div className="block">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Empty description="No transactions found" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
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
            </div>

            {/* 📄 Pagination Info */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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
                className="text-sm"
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
