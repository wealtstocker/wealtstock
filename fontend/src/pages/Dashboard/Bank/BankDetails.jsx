import React, { useState } from "react";
import BreadcrumbNav from "../../../lib/BreadcrumbNav";

const BankDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("bankDetails");

  const [userProfile] = useState({
    name: "Rohit Sharma",
    email: "rohit@example.com",
    phone: "+91 9999999999",
  });

  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    bankName: "",
    document: null,
  });

  const [addFund, setAddFund] = useState({
    amount: "",
    paymentMethod: "UPI",
    transactionRef: "",
  });

  const [withdraw, setWithdraw] = useState({
    amount: "",
    selectedAccount: "",
    reason: "",
  });

  const [savedAccounts, setSavedAccounts] = useState([
    { id: 1, name: "SBI 2023", accountNumber: "1234567890" },
  ]);

  const [showUPIDetails, setShowUPIDetails] = useState(false);

  const handleChange = (e, section) => {
    const { name, value, files } = e.target;
    if (section === "bankDetails") {
      setBankDetails({ ...bankDetails, [name]: files ? files[0] : value });
    } else if (section === "addFund") {
      setAddFund({ ...addFund, [name]: value });
    } else if (section === "withdraw") {
      setWithdraw({ ...withdraw, [name]: value });
    }
  };

  const submitBankDetails = (e) => {
    e.preventDefault();
    console.log("Updated Bank Details", bankDetails);
    alert("Bank details updated successfully!");
  };

  const submitAddFund = (e) => {
    e.preventDefault();
    console.log("Add Fund", addFund);
    setShowUPIDetails(true);
  };

  const submitWithdraw = (e) => {
    e.preventDefault();
    console.log("Withdraw", withdraw);
    alert("Withdrawal request submitted!");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* User Profile */}

      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">User Profile</h2>
        <p><strong>Name:</strong> {userProfile.name}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
        <p><strong>Phone:</strong> {userProfile.phone}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["bankDetails", "addFund", "withdraw"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowUPIDetails(false);
            }}
            className={`md:px-4 py-2 rounded-md font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {tab === "bankDetails"
              ? "Bank Details"
              : tab === "addFund"
              ? "Add Fund"
              : "Withdraw"}
          </button>
        ))}
      </div>

      {/* Bank Details Form */}
      {activeTab === "bankDetails" && (
        <form onSubmit={submitBankDetails} className="space-y-4">
          {["accountHolder", "accountNumber", "ifsc", "branch", "bankName"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block font-medium capitalize">
                {field.replace(/([A-Z])/g, " $1")} *
              </label>
              <input
                type="text"
                id={field}
                name={field}
                required
                value={bankDetails[field]}
                onChange={(e) => handleChange(e, "bankDetails")}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          ))}
          <div>
            <label htmlFor="document" className="block font-medium">
              Upload Bank Document (PDF/Image)
            </label>
            <input
              type="file"
              name="document"
              onChange={(e) => handleChange(e, "bankDetails")}
              className="block w-full border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Update Bank Details
          </button>

          <p className="text-sm text-gray-600 mt-2">
            🔒 Your bank details are securely stored and will only be used for withdrawals.
          </p>
        </form>
      )}

      {/* Add Fund */}
      {activeTab === "addFund" && (
        <form onSubmit={submitAddFund} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block font-medium">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              required
              value={addFund.amount}
              onChange={(e) => handleChange(e, "addFund")}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block font-medium">
              Payment Method *
            </label>
            <select
              name="paymentMethod"
              value={addFund.paymentMethod}
              onChange={(e) => handleChange(e, "addFund")}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>
          <div>
            <label htmlFor="transactionRef" className="block font-medium">
              Transaction Reference *
            </label>
            <input
              type="text"
              name="transactionRef"
              value={addFund.transactionRef}
              onChange={(e) => handleChange(e, "addFund")}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Add Fund
          </button>

          {showUPIDetails && (
            <div className="mt-4 text-center border p-4 rounded-lg bg-gray-100">
              <p className="font-semibold mb-2">Scan QR to Pay:</p>
              <img
                src="https://via.placeholder.com/150" // Replace with actual QR code
                alt="UPI QR Code"
                className="mx-auto"
              />
              <p className="mt-2">Or pay to UPI ID: <strong>user@upi</strong></p>
            </div>
          )}
        </form>
      )}

      {/* Withdraw */}
      {activeTab === "withdraw" && (
        <form onSubmit={submitWithdraw} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block font-medium">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              required
              value={withdraw.amount}
              onChange={(e) => handleChange(e, "withdraw")}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="selectedAccount" className="block font-medium">
              Select Bank Account *
            </label>
            <select
              name="selectedAccount"
              required
              value={withdraw.selectedAccount}
              onChange={(e) => handleChange(e, "withdraw")}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">-- Select --</option>
              {savedAccounts.map((acc) => (
                <option key={acc.id} value={acc.name}>
                  {acc.name} ({acc.accountNumber})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="reason" className="block font-medium">
              Withdrawal Reason
            </label>
            <textarea
              name="reason"
              value={withdraw.reason}
              onChange={(e) => handleChange(e, "withdraw")}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Withdraw Funds
          </button>
        </form>
      )}
    </div>
  );
};

export default BankDetailsPage;
