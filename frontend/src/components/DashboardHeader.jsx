import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaBell, FaUser, FaCog, FaLock, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const DashboardHeader = ({ onMenuClick, isSidebarOpen }) => {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    navigate("/logout");
  };
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
  

  return (
    <div
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40  bg-white drop-shadow-inherit shadow-md transition-all duration-300 ${
        isSidebarOpen ? "pl-40 md:pl-72" : "ml-0.5"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <FaBars
              className="cursor-pointer text-gray-700 text-lg"
              onClick={onMenuClick}
            />
          )
          }
          <h2 className="text-lg hidden md:flex-1/2  md:text-xl font-semibold">Admin Dashboard</h2>
        </div>

        <div className="flex items-center gap-5 relative">
          <FaBell className="text-white text-lg cursor-pointer" />

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
                  onClick={() => navigate("/profile")}
                >
                  <FaUser /> Profile
                </button>
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate("/settings")}
                >
                  <FaCog /> Settings
                </button>
                <button
                  className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => navigate("/change-password")}
                >
                  <FaLock /> Change Password
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
