import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaUser, FaCog, FaSignOutAlt, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux"; 

const DashboardHeader = ({ onMenuClick, isSidebarOpen }) => {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Get user from Redux or LocalStorage fallback
  const user = useSelector((state) => state.auth.admin) || JSON.parse(localStorage.getItem("admin"));
  // const { balance, loading } = useSelector((state) => state.wallet || {}); // Optional if wallet slice is used

  // useEffect(() => {
  //   dispatch(fetchWalletBalance());
  // }, [dispatch]);

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
   
    localStorage.removeItem("admin"); 
    localStorage.removeItem("token");
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
          <h2 className="text-lg md:text-xl font-semibold">Admin Dashboard</h2>
        </div>

        <div className="flex items-center gap-6 relative">
          {/* ✅ Wallet */}
          {/* <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
            <FaWallet className="text-lg" />
            {loading ? "..." : `₹${balance?.toFixed(2) || "0.00"}`}
          </div> */}

          {/* ✅ Profile */}
          <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="cursor-pointer w-9 h-9 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold uppercase"
            >
              {user?.full_name ? user.full_name.charAt(0) : <FaUser />}
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-2 font-semibold border-b">
                  {user?.full_name || "Admin"}
                </div>
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate("/admin/profile")}
                >
                  <FaUser /> Profile
                </button>
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate("/admin/settings")}
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
