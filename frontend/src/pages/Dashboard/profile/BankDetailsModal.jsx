import React, { useState } from 'react';

const BankDetailsModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    bankName: '',
    accountNumber: '',
    confirmAccount: '',
    ifsc: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.accountNumber !== form.confirmAccount) {
      alert('Account numbers do not match.');
      return;
    }
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Add Bank Account</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bank Full Name</label>
            <input
              type="text"
              name="bankName"
              className="w-full border rounded px-3 py-2"
              value={form.bankName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="password"
              name="accountNumber"
              className="w-full border rounded px-3 py-2"
              value={form.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Account Number</label>
            <input
              type="text"
              name="confirmAccount"
              className="w-full border rounded px-3 py-2"
              value={form.confirmAccount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">IFSC Code</label>
            <input
              type="text"
              name="ifsc"
              className="w-full border rounded px-3 py-2"
              value={form.ifsc}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;