import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  BarChart,
  Banknote,
  Globe,
  CheckCircle2,
  LogOut,
  ChevronDown,
  Settings,
  HistoryIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import { BsBank } from "react-icons/bs";
import { FaRupeeSign, FaTimes } from "react-icons/fa";
import { logout } from "../redux/Slices/authSlice";
import { useDispatch } from "react-redux";
import { Button } from "antd";

const DashboardSidebar = ({ isOpen, onClose }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState("Dashboards");
  const [submenuOpen, setSubmenuOpen] = useState(null);

  const handleItemClick = (label, url) => {
    setActiveItem(label);
    if (url) navigate(url);
    if (onClose) onClose();
  };
  const toggleSubmenu = (label) => {
    setSubmenuOpen((prev) => (prev === label ? null : label));
  };


  const handleLogout = () => {
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  const menuSections = [
    {
      section: null,
      items: [
        { icon: <Home size={18} />, label: "Dashboard Overview", url: "/dashboard" },
      ],
    },
    {
      section: "My Account",
      items: [
        { icon: <User size={18} />, label: "My Profile", url: "/dashboard/profile" },
        { icon: <Settings size={18} />, label: "Settings", url: "/dashboard/settings" },
      ],
    },
    {
      section: "Trading",
      items: [
        { icon: <BarChart size={18} />, label: "My Trades", url: "/dashboard/trades" },
        { icon: <Banknote size={18} />, label: "Market Watch", url: "/dashboard/trade/markets" },
        { icon: <Banknote size={18} />, label: "Request Trade", url: "/dashboard/trade/request" },
        { icon: <CheckCircle2 size={18} />, label: "Pending Requests", url: "/dashboard/trades/requestlist" },
      ],
    },
    {
      section: "Wallet & Finance",
      items: [
        {
          icon: <FaRupeeSign size={18} />,
          label: "Wallet",
          submenu: true,
          children: [
            { label: "Add Fund", url: "/dashboard/add-fund" },
            { label: "Withdraw", url: "/dashboard/withdrawal" },
            { label: "Transaction History", url: "/dashboard/wallet" },
          ],
        },
        {
          icon: <BsBank size={18} />,
          label: "Bank Details",
          url: "/dashboard/bank",
        },
        {
          icon: <HistoryIcon size={18} />,
          label: "Fund Report",
          url: "/dashboard/payment",
        },
      ],
    },

  ];



  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-gray-50 z-45 shadow-inner transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg`}
    >
      {/* Sticky Header */}
      <div className="p-4 border-b sticky top-0 z-50   flex items-center justify-between">
        <h2 className="text-xl font-bold text-red-600">Wealthstocker Research Firm</h2>
        <button onClick={onClose}>
          <FaTimes className="text-red-600 text-lg hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Menu Sections */}
      <div className="px-4 py-4 overflow-y-auto h-[calc(100vh-64px)] text-sm space-y-4">
        {menuSections.map(({ section, items }, idx) => (
          <div key={section || `section-${idx}`}>
            {section && (
              <p className="text-gray-400 uppercase text-xs font-semibold mb-1 border-b pb-1 border-dashed border-gray-200">
                {section}
              </p>
            )}
            {items.map((item) => (
              <div key={item.label}>
                {/* Main Item */}
                <div
                  onClick={() => {
                    if (!item.submenu) handleItemClick(item.label, item.url);
                    else toggleSubmenu(item.label);
                  }}
                  className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-md transition-all duration-300 ease-in-out ${activeItem === item.label
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-3 text-base">
                    <span
                      className={`${activeItem === item.label
                        ? "text-red-600"
                        : "text-gray-700"
                        }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.submenu && (
                    <span
                      className={`transition-transform duration-300 ${submenuOpen === item.label ? "rotate-180" : "rotate-0"
                        }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  )}
                </div>

                {/* Submenu */}
                {item.submenu && (
                  <div
                    className={`ml-6 transition-all duration-300 ease-in-out overflow-hidden ${submenuOpen === item.label
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="mt-2 space-y-1 border-l pl-3 border-gray-200">
                      {item.children.map((subitem) => (
                        <div
                          key={subitem.label}
                          onClick={() =>
                            handleItemClick(subitem.label, subitem.url)
                          }
                          className={`block px-2 py-1 rounded cursor-pointer transition-all ${activeItem === subitem.label
                            ? "bg-blue-100 font-semibold"
                            : "hover:bg-gray-100"
                            }`}
                        >
                          {subitem.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
            <div className="p-4 border-t absolute bottom-0 w-full bg-white">
              <Button
                onClick={handleLogout}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <LogOut size={18} />
                Log Out
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;
