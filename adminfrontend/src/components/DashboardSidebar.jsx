import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  BarChart,
  Banknote,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings,
  LogOut,
  QrCode,
  FileText,
  UserCheck,
  UserX,
} from "lucide-react";
import { BsBank } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { logout } from "../redux/Slices/authSlice";
import { useDispatch } from "react-redux";

const DashboardSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [submenuOpen, setSubmenuOpen] = useState(null);

  const handleItemClick = (label, url, isLogout = false) => {
    setActiveItem(label);
    if (isLogout) {
      dispatch(logout());
      navigate("/login");
    } else {
      if (url) navigate(url);
    }
    if (onClose) onClose();
  };

  const toggleSubmenu = (label) => {
    setSubmenuOpen((prev) => (prev === label ? null : label));
  };

  const menuSections = [
    {
      section: null,
      items: [
        {
          icon: <Home size={18} />,
          label: "Dashboard",
          url: "/dashboard",
        },
      ],
    },
    // {
    //   section: "User Management",
    //   items: [
    //     {
    //       icon: <Users size={18} />,
    //       label: "All Users",
    //       url: "/admin/users",
    //     },
    //     {
    //       icon: <UserCheck size={18} />,
    //       label: "Approved Users",
    //       url: "/dashboard/users/approved",
    //     },
    //     {
    //       icon: <UserX size={18} />,
    //       label: "Rejected Users",
    //       url: "/dashboard/users/rejected",
    //     },
    //     {
    //       icon: <FileText size={18} />,
    //       label: "Pending Approvals",
    //       url: "/dashboard/users/pending",
    //     },
    //   ],
    // },
    {
      section: "Client Management",
      items: [
        {
          icon: <Users size={18} />,
          label: "Clients",
          url: "/admin/customers",
        },
        {
          icon: <BarChart size={18} />,
          label: "Trade Management",
          url: "/admin/trades",
        },
        {
          icon: <ArrowDownCircle size={18} />,
          label: "Fund-Req",
          url: "/admin/fund-requests",
        },
        {
          icon: <CreditCard size={18} />,
          label: "Transactions",
          url: "/admin/transactions",
        },
        {
          icon: <CreditCard size={18} />,
          label: "Withdrawal",
          url: "/admin/withdrawal",
        },
        
      ],
    },
    {
      section: "Funds",
      items: [
        {
          icon: <Banknote size={18} />,
          label: "All User Funds",
          url: "/admin/all-wallet",
        },
        {
          icon: <ArrowDownCircle size={18} />,
          label: "Pay-In Requests",
          url: "/admin/fund-requests",
        },
        {
          icon: <ArrowUpCircle size={18} />,
          label: "Pay-Out Requests",
          url: "/admin/fund-request/payout",
        },
      ],
    },
    {
      section: "Finance",
      items: [
        // {
        //   icon: <BsBank size={18} />,
        //   label: "Bank Accounts",
        //  url: "/admin/site-config",
        // },
        {
          icon: <BsBank size={18} />,
          label: "Site Config",
          url: "/admin/site-config",
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          icon: <Settings size={18} />,
          label: "Admin Settings",
          url: "/dashboard/settings",
        },
      ],
    },
    {
      section: " ",
      items: [
        {
          icon: <LogOut size={18} />,
          label: "Log Out",
          url: "/login",
          logout: true,
        },
      ],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-gray-50 z-45 shadow-inner transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out shadow-lg`}
    >
      {/* Header */}
      <div className="p-4 border-b sticky top-0 z-50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-red-600">Admin Panel</h2>
        <button onClick={onClose}>
          <FaTimes className="text-red-600 text-lg hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Menu */}
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
                <div
                  onClick={() =>
                    handleItemClick(item.label, item.url, item.logout)
                  }
                  className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md transition-all duration-300 ease-in-out ${
                    activeItem === item.label
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;
