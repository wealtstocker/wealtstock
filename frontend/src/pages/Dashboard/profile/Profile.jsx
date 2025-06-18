import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerById } from "../../../redux/Slices/customerSlice";
import axiosInstance from "../../../api/axiosInstance";
import WithdrawRequestModal from "./WithdrawRequestModal";
import AddFund from "./AddFund";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { data: customer, loading } = useSelector((state) => state.customer);
  const [showBankModal, setShowBankModal] = useState(false);
  const [Profile, setProfile] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const fetchBanks = async () => {
    try {
      const res = await axiosInstance.get("/customer/bank");
      const bank = res.data?.banks?.[0] || null;
      setBankDetails(bank);
    } catch (err) {
      console.error("Error fetching banks:", err);
    }
  };


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      dispatch(fetchCustomerById(user.id));
    }
    fetchBanks()
  }, [dispatch]);

  const handleUpdateProfile = () => setProfile((prev) => !prev);

  if (loading || !customer) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen py-5 px-2 font-sans">
      {Profile ? (
        <EditProfilePage userData={customer || user} onClose={handleUpdateProfile} />

      ) : (
        <div className="bg-white rounded-3xl p-2 md:p-3 max-w-7xl w-full mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 relative">
              <img
                src={customer.profile_image || "https://i.pravatar.cc/100"}
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
                  {customer.full_name || "N/A"}
                </h2>
                <p className="text-sm text-gray-500">ID: {customer.id}</p>
                <p className="text-green-700 font-medium text-sm">
                  💰 Coins: {customer.coinBalance || 0}
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
              <strong>Email:</strong> {customer.email || "N/A"}
            </div>
            <div>
              <strong>Phone:</strong> {customer.phone_number || "N/A"}
            </div>
            <div>
              <strong>Date of Birth:</strong>{" "}
              {customer.dob ? new Date(customer.dob).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <strong>Gender:</strong> {customer.gender || "N/A"}
            </div>
            <div className="col-span-2">
              <strong>Address:</strong> {customer.address || "N/A"}, {customer.city}, {customer.state}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border-l-4 border-green-500 p-4 shadow">
              <h4 className="font-bold text-green-800 mb-2">Trading Account Details</h4>
              <p>
                <strong>Account Type:</strong> {customer.account_type || "N/A"}
              </p>
              <p>
                <strong>Customer No:</strong> {customer.customer_no || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> <span className="text-green-600 font-semibold">{customer.is_active ? "Active" : "Inactive"}</span>
              </p>
            </div>

            <div className="bg-white rounded-lg border-l-4 border-indigo-500 p-4 shadow">
              <h4 className="font-bold text-indigo-800 mb-2">PAN & KYC</h4>
              <p>
                <strong>PAN:</strong> {customer.pan_number || "N/A"}
              </p>
              <p>
                <strong>Aadhaar:</strong> {customer.aadhar_number || "N/A"}
              </p>
              <p>
                <strong>KYC Verified:</strong> ✅
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
                  {customer.coinBalance || 0} 🪙
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  onClick={() => setShowFundModal(!showFundModal)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm rounded shadow"
                >
                  Add Money
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded shadow"
                  onClick={() => setShowWithdraw(true)}
                >
                  Withdraw
                </button>
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-4 border-l-4 border-blue-500 shadow">
              <h4 className="font-bold text-blue-800 flex items-center gap-2"><FaUniversity /> Bank Details</h4>
              {bankDetails ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Holder: {bankDetails.account_holder_name}</p>
                  <p>Bank: {bankDetails.bank_name}</p>
                  <p>Acc No: {bankDetails.account_number}</p>
                  <p>IFSC: {bankDetails.ifsc_code}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No bank account added.</p>
              )}
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
              <FaShareAlt /> Referral Code: <strong>{customer.referral_code || "N/A"}</strong>
            </div>
            <div className="text-sm text-purple-600">
              Total Earnings: ₹{customer.earnings || 0}
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-6">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm shadow">
                <FaLock /> Change Password
              </button>
            </div>
            <div className="bg-indigo-100 px-4 py-2 rounded shadow flex items-center gap-2 text-indigo-700 text-sm">
              <FaTrophy /> Level: Gold Member
            </div>
          </div> */}
        </div>
      )}
      {showBankModal && (
        <BankDetailsModal
          isOpen={showBankModal}
          initialData={bankDetails}
          onClose={() => setShowBankModal(false)}
          onSuccess={() => {
            fetchBanks();
            setShowBankModal(false);
          }}
        />
      )}
      {showFundModal && (
        <AddFund onClose={() => setShowFundModal(false)} />
      )}
      {showWithdraw && (
        <WithdrawRequestModal onClose={() => setShowWithdraw(false)} />
      )}
    </div>
  );
};

export default ProfilePage;