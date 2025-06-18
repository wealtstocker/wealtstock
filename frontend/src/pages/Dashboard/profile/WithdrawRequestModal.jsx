import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../../api/axiosInstance";

const WithdrawRequestModal = ({ onClose }) => {
  const [bank, setBank] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchUserBank();
  }, []);

  const fetchUserBank = async () => {
    try {
      const res = await axiosInstance.get("/customer/bank");
      const userBank = res.data.banks?.[0] || null;
      if (userBank) {
        setBank(userBank);
      } else {
        Swal.fire("No Bank", "Please add a bank account first", "warning");
      }
    } catch (err) {
      console.error("Failed to fetch banks:", err);
      Swal.fire("Error", "Unable to load bank account", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !bank?.id) {
      return Swal.fire("Error", "Please enter an amount", "error");
    }

    try {
      const res = await axiosInstance.post("/wallet/withdraw", {
        amount: Number(amount),
        bank_account_id: bank.id,
      });
console.log(res)
      Swal.fire("Success", "Withdraw request submitted", "success");
      setAmount("");

      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      console.error("Withdraw error", error);
      Swal.fire("Error", "Failed to submit withdraw request", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Withdraw Request</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bank Info */}
          {bank ? (
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-800 font-medium">
                👤 {bank.account_holder_name}
              </p>
              <p className="text-gray-600 text-sm">
                🏦 {bank.bank_name} - {bank.account_number}
              </p>
            </div>
          ) : (
            <p className="text-sm text-red-500">No bank account found</p>
          )}

          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block font-medium">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!bank}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Submit Withdraw Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawRequestModal;
