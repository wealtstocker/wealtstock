import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";
import { fetchWalletBalance } from "../../../redux/Slices/walletSlice";// Adjust this path as needed

const WithdrawRequestPage = () => {
  const [bank, setBank] = useState(null);
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { balance, loading } = useSelector((state) => state.wallet);

  // Fetch wallet balance using Redux
  useEffect(() => {
    dispatch(fetchWalletBalance());
  }, [dispatch]);

  // Fetch bank details from API
  useEffect(() => {
    fetchUserBank();
  }, []);

  const fetchUserBank = async () => {
    try {
      const res = await axiosInstance.get("/customer/bank");
      const userBank = res.data.banks?.[0] || null;
      setBank(userBank);
    } catch (err) {
      console.error("Bank fetch error", err);
      Swal.fire("Error", "Unable to load bank account", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) < 10 || !bank?.id) {
      return Swal.fire("Error", "Please enter a valid amount (min ₹10)", "error");
    }

    try {
      await axiosInstance.post("/wallet/withdraw", {
        amount: Number(amount),
        bank_account_id: bank.id,
      });

      Swal.fire("Success", "Withdrawal request submitted", "success");
      setAmount("");
      dispatch(fetchWalletBalance());
    } catch (error) {
      console.error("Withdraw error", error);
      Swal.fire("Error", "Failed to submit withdrawal", "error");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">💸 Withdrawal Now</h2>

      {/* Balance Display */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p className="text-2xl font-semibold text-green-700">
          ₹{loading ? "Loading..." : balance ?? "0.00"}
        </p>
        <p className="text-gray-600 text-sm">Available Balance</p>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-700 mb-4">
        <h4 className="font-semibold mb-2 text-center">📝 STEPS TO WITHDRAWAL</h4>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Add Bank details.</li>
          <li>If already exists it will show below.</li>
          <li>Enter the amount you want to withdraw.</li>
        </ol>
        <p className="mt-2 text-gray-600 text-xs">
          <strong>Note:</strong> Minimum withdrawal is ₹10. Funds will be transferred to your
          bank account within 24–48 hours during working hours.
        </p>
      </div>

      {/* Withdrawal Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Info */}
        {bank ? (
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-gray-800 font-medium">👤 {bank.account_holder_name}</p>
            <p className="text-gray-600 text-sm">
              🏦 {bank.bank_name} - {bank.account_number}
            </p>
          </div>
        ) : (
          <div className="bg-red-50 p-3 border border-red-300 text-red-600 text-sm rounded-md">
            <p>⚠️ Alert: No bank account added.</p>
            <button
              onClick={() => navigate("/dashboard/bank")}
              type="button"
              className="mt-2 text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              ➕ Add Bank Account
            </button>
          </div>
        )}

        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            min="10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount (min ₹10)"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!bank || loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Submit Withdrawal Request
        </button>
      </form>
    </div>
  );
};

export default WithdrawRequestPage;
