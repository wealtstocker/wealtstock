import React, { useState } from "react";
import {
  FaUserEdit,
  FaWallet,
  FaUniversity,
  FaLock,
  FaTrophy,
  FaShareAlt,
} from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import BankDetailsModal from "./BankDetailsModal";
import EditProfilePage from "./EditProfilePage";

const ProfilePage = () => {
  const [showBankModal, setShowBankModal] = useState(false);
  const [Profile, setProfile] = useState(false);
  const [upi, setUpi] = useState("amit@ybl");

  const user = {
    name: "Amit Sharma",
    email: "amit@example.com",
    phone: "+91 9876543210",
    userId: "USER12345",
    dob: "1995-04-15",
    gender: "Male",
    address: "Ujjain, Madhya Pradesh, India",
    coinBalance: "2,500",
    referralCode: "AMIT123REF",
    earnings: 1250,
    pan: "ABCDE1234F",
    broker: "Zerodha",
    dematAcc: "120XXXXX456",
    tradingAcc: "TRD78901234",
    accountType: "Individual",
    accountStatus: "Active",
  };
  const handleUpdateProfile = () => setProfile((prev) => !prev);
  const handleBankUpdate = () => {
    // Replace with API call in real case
    console.log("New UPI:", upi);
    setShowBankModal(false);
  };

  return (
    <div className="min-h-screen  py-5 px-2 font-sans">
      {Profile ? (
        <EditProfilePage onClose={handleUpdateProfile} />
      ) : (
        <div className="bg-white rounded-3xl   p-2 md:p-3 max-w-7xl w-full mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 relative">
              <img
                src="https://i.pravatar.cc/100"
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
              />
              <button
                className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full text-white"
                title="Edit Picture"
              >
                <FiEdit3 size={16} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">ID: {user.userId}</p>
                <p className="text-green-700 font-medium text-sm">
                  💰 Coins: {user.coinBalance}
                </p>
              </div>
            </div>
            <button
              onClick={handleUpdateProfile}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow text-sm font-semibold"
            >
              <FaUserEdit /> Edit Profile
            </button>
          </div>

          <div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Your profile is 85% ready for trading.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Phone:</strong> {user.phone}
            </div>
            <div>
              <strong>Date of Birth:</strong> {user.dob}
            </div>
            <div>
              <strong>Gender:</strong> {user.gender}
            </div>
            <div className="col-span-2">
              <strong>Address:</strong> {user.address}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border-l-4 border-green-500 p-4 shadow">
              <h4 className="font-bold text-green-800 mb-2">
                Trading Account Details
              </h4>
              <p>
                <strong>Broker:</strong> {user.broker}
              </p>
              <p>
                <strong>Account Type:</strong> {user.accountType}
              </p>
              <p>
                <strong>Demat A/C:</strong> {user.dematAcc}
              </p>
              <p>
                <strong>Trading A/C:</strong> {user.tradingAcc}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  {user.accountStatus}
                </span>
              </p>
            </div>

            <div className="bg-white rounded-lg border-l-4 border-indigo-500 p-4 shadow">
              <h4 className="font-bold text-indigo-800 mb-2">PAN & KYC</h4>
              <p>
                <strong>PAN:</strong> {user.pan}
              </p>
              <p>
                <strong>KYC Verified:</strong> ✅
              </p>
              <p>
                <strong>Aadhaar Linked:</strong> Yes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-100 rounded-lg p-4 border-l-4 border-yellow-500 shadow">
              <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                <FaWallet /> Wallet
              </h4>
              <div className="flex justify-between">
                <span className="text-sm">Balance</span>
                <span className="font-semibold text-yellow-700">
                  {user.coinBalance} 🪙
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm rounded shadow">
                  Add Money
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded shadow">
                  Withdraw
                </button>
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-4 border-l-4 border-blue-500 shadow">
              <h4 className="font-bold text-blue-800 flex items-center gap-2">
                <FaUniversity /> Bank Details
              </h4>
              <p className="text-sm text-gray-700 mt-1">UPI: {upi}</p>
              <button
                onClick={() => setShowBankModal(true)}
                className="mt-2 text-xs underline text-blue-700 hover:text-blue-900"
              >
                Edit Bank Info
              </button>
            </div>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-purple-800 text-sm">
              <FaShareAlt /> Referral Code: <strong>{user.referralCode}</strong>
            </div>
            <div className="text-sm text-purple-600">
              Total Earnings: ₹{user.earnings}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-6">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm shadow">
                <FaLock /> Change Password
              </button>
            </div>
            <div className="bg-indigo-100 px-4 py-2 rounded shadow flex items-center gap-2 text-indigo-700 text-sm">
              <FaTrophy /> Level: Gold Member
            </div>
          </div>
        </div>
      )}

      {showBankModal && (
        <BankDetailsModal
          isOpen={showBankModal}
          onClose={() => setShowBankModal(false)}
          onSubmit={(formData) =>
            console.log("Bank details submitted:", formData)
          }
        />
      )}
    </div>
  );
};

export default ProfilePage;
