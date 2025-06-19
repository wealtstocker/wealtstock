import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaUser, FaCog, FaSignOutAlt, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Slices/authSlice";
import { fetchWalletBalance } from "../redux/Slices/walletSlice";

const DashboardHeader = ({ onMenuClick, isSidebarOpen }) => {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);

  const { balance, loading } = useSelector((state) => state.wallet);
const [user, setUser] = useState(null);

// Get user data from localStorage on component mount
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    }
  }
}, []);


  useEffect(() => {
    dispatch(fetchWalletBalance()); 
  }, [dispatch]);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!headerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-all duration-300 ${
        isSidebarOpen ? "pl-0 md:pl-72" : "ml-0.5"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <FaBars
              className="cursor-pointer text-gray-700 text-lg"
              onClick={onMenuClick}
            />
          )}
        <h2 className="text-lg md:text-xl font-semibold">
  Welcome {user?.full_name ? user.full_name : ""}
</h2>
        </div>

        <div className="flex items-center gap-6 relative">
          {/* ✅ Wallet Section */}
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
            <FaWallet className="text-lg" />
            {loading ? "..." : `₹${balance || balance.toFixed(2) || "0"} `}
          </div>

          {/* ✅ Profile Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="cursor-pointer w-9 h-9 rounded-full bg-white text-[#132e57] flex items-center justify-center font-bold"
            >
              <FaUser />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  <FaUser /> Profile
                </button>
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate("/dashboard/settings")}
                >
                  <FaCog /> Settings
                </button>
                <hr />
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
