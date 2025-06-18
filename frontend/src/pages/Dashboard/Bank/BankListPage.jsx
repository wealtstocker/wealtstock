import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaUniversity } from "react-icons/fa";
import BankDetailsModal from "../profile/BankDetailsModal";
import axiosInstance from "../../../api/axiosInstance";

const BankListPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankList, setBankList] = useState([]);
  const fetchBanks = async () => {
    try {
      const res = await axiosInstance.get("/customer/bank");
  
      setBankList(res.data.banks || []); 
    } catch (err) {
      console.error("Error fetching banks:", err);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const bank = bankList[0]; // only show the first bank

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <FaUniversity className="text-blue-600 text-xl" />
        <h1 className="text-xl font-bold text-gray-800">Bank Details</h1>
      </div>

      {bank ? (
        <div className="border p-4 rounded-lg shadow-sm bg-gray-50 flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg">{bank.account_holder_name}</p>
            <p className="text-gray-700">
              {bank.bank_name} - {bank.account_number}
            </p>
            <p className="text-sm text-gray-500">IFSC: {bank.ifsc_code}</p>
            <p className="text-xs text-green-600 mt-2">✔ Verified Bank Account</p>
          </div>
          <button
            onClick={() => {
              setSelectedBank(bank);
              setShowModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-500 text-white rounded"
          >
            <FaEdit /> Edit
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-2 text-gray-700">No bank account added yet.</p>
          <button
            onClick={() => {
              setSelectedBank(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaPlus /> Add Bank
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4 italic">
        📌 Note: Only one bank account is allowed. Contact support to replace or verify a different bank.
      </p>

      <BankDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedBank}
        onSuccess={fetchBanks}
      />
    </div>
  );
};

export default BankListPage;
