import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaArrowDown, FaArrowUp, FaUserPlus, FaMoneyCheckAlt } from "react-icons/fa";
import { Table, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../redux/Slices/customerSlice";
import { fetchFundRequests } from "../../redux/Slices/fundSlice";
import { fetchAllBalances } from "../../redux/Slices/balanceSlice";
import { fetchAllWithdrawals } from "../../redux/Slices/withdrawalSlice";
import { Link } from "react-router-dom";

const DashboardChildFinance = () => {
  const sectionRef = useRef(null);
  const dispatch = useDispatch();

  const { balances } = useSelector((state) => state.balance);
  const { all: customers } = useSelector((state) => state.customer);
  const { fundRequests } = useSelector((state) => state.fund);
  const { list: withdrawals } = useSelector((state) => state.withdrawals);

  const [search, setSearch] = useState("");
  const [filteredFundData, setFilteredFundData] = useState([]);
  const [completedWithdrawals, setCompletedWithdrawals] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [rejectedWithdrawals, setRejectedWithdrawals] = useState([]);

  useEffect(() => {
    gsap.fromTo(sectionRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
  }, []);

  useEffect(() => {
    dispatch(fetchAllCustomers());
    dispatch(fetchAllBalances());
    dispatch(fetchFundRequests());
    dispatch(fetchAllWithdrawals());
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

    const successFunds = enriched.filter((item) => item.status === "successful");
    const searched = search
      ? successFunds.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase())
      )
      : successFunds;

    setFilteredFundData(searched);

    // Withdrawals filters
    setCompletedWithdrawals(withdrawals.filter((w) => w.status === "completed"));
    setPendingWithdrawals(withdrawals.filter((w) => w.status === "pending"));
    setRejectedWithdrawals(withdrawals.filter((w) => w.status === "rejected"));
  }, [fundRequests, customers, search, withdrawals]);

  return (
    <div ref={sectionRef} className="space-y-6">
      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to={"/admin/all-wallet"} title="All wallet">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
            <FaMoneyCheckAlt className="text-blue-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Total Fund Requests</p>
              <h3 className="text-lg font-semibold">{fundRequests.length}</h3>
            </div>
          </div>
        </Link>
        <Link to={"/admin/withdrawal"} title="All Withdrawal">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
            <FaArrowUp className="text-green-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Completed Withdrawals</p>
              <h3 className="text-lg font-semibold">{completedWithdrawals.length}</h3>
            </div>
          </div>
        </Link>
        <Link to={"/admin/withdrawal"} title="All Withdrawal">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
            <FaArrowDown className="text-yellow-500 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Pending Withdrawals</p>
              <h3 className="text-lg font-semibold">{pendingWithdrawals.length}</h3>
            </div>
          </div>
        </Link>
        <Link to={"/admin/withdrawal"} title="All Withdrawal">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
            <FaArrowUp className="text-red-500 rotate-180 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Rejected Withdrawals</p>
              <h3 className="text-lg font-semibold">{rejectedWithdrawals.length}</h3>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Fund Deposits & Withdrawals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
        {/* Fund Deposits */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center gap-2 text-blue-600 mb-2 font-semibold">
            <FaArrowDown /> Recent Fund Deposits
          </div>
          <ul className="text-sm space-y-2">
            {filteredFundData.slice(0, 5).map((d) => (
              <li key={d.id} className="flex justify-between text-gray-700 border-gray-400 border-b pb-2 last:border-none">
                <span>{d.full_name}</span>
                <span className="text-green-600 font-medium">₹{d.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Completed Withdrawals */}
        <div className="bg-white p-4 rounded-xl shadow">
          <Link to={"/admin/withdrawal"} title="All Withdrawal">
            <div className="flex items-center gap-2 text-red-600 hover:border-b border-blue-400 mb-2 font-semibold">
              <FaArrowUp /> Recent Withdrawals
            </div>
          </Link>

          <ul className="text-sm space-y-2">
            {completedWithdrawals.slice(0, 5).map((w, i) => (
              <li key={w.withdrawal_id || i} className="flex justify-between text-gray-700 border-gray-400  border-b pb-2 last:border-none">
                <span>{w.full_name || "N/A"}</span>
                <span className="text-red-500 font-medium">₹{w.amount}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* New Customers List */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center gap-2 text-purple-600 mb-2 font-semibold">
            <FaUserPlus /> New Customers
          </div>
          <ul className="text-sm space-y-2">
            {customers.slice(0, 5).map((c) => (
              <li key={c.id} className="border-b pb-2 last:border-none" >
                <Link to={`/admin/customer/${c.id}`}>
                  <p className="font-medium">{c.full_name}</p>
                  <p className="text-gray-500 text-xs">{c.id}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default DashboardChildFinance;
