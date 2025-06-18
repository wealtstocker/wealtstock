import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";

const BankDetailsModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    account_holder_name: "",
    bank_name: "",
    ifsc_code: "",
    account_number: "",
  });
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        account_holder_name: "",
        bank_name: "",
        ifsc_code: "",
        account_number: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (initialData) {
        await axiosInstance.put(`/customer/update-bank/${initialData.id}`, formData);
      } else {
        await axiosInstance.post("/customer/add-bank", formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Error saving bank:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[whitesmoke] bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {initialData ? "Edit Bank Details" : "Add Bank Details"}
        </h2>

        <input
          type="text"
          name="account_holder_name"
          placeholder="Account Holder Name"
          className="w-full border p-2 mb-2 rounded"
          value={formData.account_holder_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bank_name"
          placeholder="Bank Name"
          className="w-full border p-2 mb-2 rounded"
          value={formData.bank_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ifsc_code"
          placeholder="IFSC Code"
          className="w-full border p-2 mb-2 rounded"
          value={formData.ifsc_code}
          onChange={handleChange}
        />
        <input
          type="text"
          name="account_number"
          placeholder="Account Number"
          className="w-full border p-2 mb-4 rounded"
          value={formData.account_number}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;
