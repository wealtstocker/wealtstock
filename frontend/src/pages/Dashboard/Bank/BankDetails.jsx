import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddFundPage from "../profile/AddFundPage";
import WithdrawRequestPage from "./WithdrawRequestPage";
import BankListPage from "./BankListPage";
import axiosInstance from "../../../api/axiosInstance";
import { FaUserCircle, FaWallet } from "react-icons/fa";
import { fetchWalletBalance } from "../../../redux/Slices/walletSlice";

const BankDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("bankDetails");

  const { data: customer, loading: customerLoading } = useSelector(
    (state) => state.customer
  );
 const { balance, loading } = useSelector((state) => state.wallet);
   const dispatch = useDispatch();

   useEffect(() => {
     dispatch(fetchWalletBalance()); 
   }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* USER DETAILS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl text-blue-600" />
          <div>
            <p className="text-lg font-semibold">
              {customer?.full_name || "User Name"}
            </p>
            <p className="text-sm text-gray-600">{customer?.email}</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <FaWallet className="text-green-600 text-xl" />
          <p className="font-medium text-gray-800">
            Balance: ₹{balance !== null ? balance : "Loading..."}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        {["bankDetails", "addFund", "withdraw"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {tab === "bankDetails"
              ? "🏦 Bank Details"
              : tab === "addFund"
              ? "💰 Add Fund"
              : "💸 Withdraw"}
          </button>
        ))}
      </div>

      {/* TAB PANELS */}
      <div>
        {activeTab === "bankDetails" && <BankListPage />}
        {activeTab === "addFund" && <AddFundPage />}
        {activeTab === "withdraw" && <WithdrawRequestPage />}
      </div>
    </div>
  );
};

export default BankDetailsPage;
