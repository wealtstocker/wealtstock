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
  Contact,
  Contact2Icon,
  GitPullRequest,
} from "lucide-react";
import { BsBank } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { logout } from "../redux/Slices/authSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const DashboardSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [submenuOpen, setSubmenuOpen] = useState(null);

  const handleItemClick = (label, url, isLogout = false) => {
    setActiveItem(label);
    console.log(isLogout)
    if (isLogout) {
     handleLogout()
    } else {
      if (url) navigate(url);
    }
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
      navigate("/");
    };
 const menuSections = [
  {
    section: null,
    items: [
      {
        icon: <Home size={18} />,
        label: "Dashboard Overview",
        url: "/admin/dashboard",
      },
    ],
  },
  {
    section: "Clients",
    items: [
      {
        icon: <UserX size={18} />,
        label: "Pending Clients",
        url: "/admin/customers/inactive",
      },
      {
        icon: <Users size={18} />,
        label: "All Clients",
        url: "/admin/customers",
      },
    ],
  },
  {
    section: "Trades",
    items: [
      {
        icon: <GitPullRequest size={18} />,
        label: "Trade Requests",
        url: "/admin/traderequest",
      },
      {
        icon: <BarChart size={18} />,
        label: "Trade Management",
        url: "/admin/trades",
      },
    ],
  },
  {
    section: "Wallet & Funds",
    items: [
      {
        icon: <Banknote size={18} />,
        label: "Client Wallets",
        url: "/admin/all-wallet",
      },
      {
        icon: <ArrowDownCircle size={18} />,
        label: "Pay-In Records",
        url: "/admin/pay-in",
      },
      {
        icon: <ArrowUpCircle size={18} />,
        label: "Pay-Out Records",
        url: "/admin/pay-out",
      },
      {
        icon: <ArrowDownCircle size={18} />,
        label: "Fund Requests",
        url: "/admin/fund-requests",
      },
      {
        icon: <CreditCard size={18} />,
        label: "Withdrawals",
        url: "/admin/withdrawal",
      },
    ],
  },
  {
    section: "Communication",
    items: [
      {
        icon: <Contact size={18} />,
        label: "Contact Messages",
        url: "/admin/contact",
      },
      {
        icon: <Contact2Icon size={18} />,
        label: "Callback Requests",
        url: "/admin/callback",
      },
    ],
  },
  {
    section: "Configuration",
    items: [
      {
        icon: <BsBank size={18} />,
        label: "Site Settings",
        url: "/admin/site-config",
      },
      // Optional future setting page
      // {
      //   icon: <Settings size={18} />,
      //   label: "Admin Settings",
      //   url: "/admin/settings",
      // },
    ],
  },
  {
    section: " ",
    items: [
      {
        icon: <LogOut size={18} />,
        label: "Log Out",
        url: "/",
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
