import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Button, Dropdown, Avatar } from "antd";
import { HomeOutlined, InfoCircleOutlined, PhoneOutlined, LoginOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../assets/logon.jfif";
import {
  FaServicestack,
} from "react-icons/fa";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

   const navItems = [
    { to: "/", label: "Home", icon: <HomeOutlined /> },
    { to: "/about", label: "About", icon: <InfoCircleOutlined /> },
    { to: "/services", label: "Services", icon: <FaServicestack /> },
    { to: "/contact", label: "Contact", icon: <PhoneOutlined /> },
  ];


  const userMenu = (
    <Menu>
      <Menu.Item key="dashboard">
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="profile">
        <Link to="/dashboard/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
      }}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-md p-4 fixed w-full z-50 flex items-center justify-between">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/" title="Go to Home - Finance Market">
          <img src={Logo} alt="Logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex flex-1 justify-center gap-6 text-gray-700 font-medium">
        {navItems.map(({ to, label, icon }) => (
          <li key={label}>
            <Link to={to} className="flex items-center gap-2 hover:text-blue-600 transition">
              {icon}
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop Right Controls */}
      <div className="hidden md:flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm font-medium text-gray-700">
              👋 {user.full_name?.split(" ")[0] || "User"}
            </span>
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Avatar icon={<UserOutlined />} className="cursor-pointer bg-blue-600" />
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <LoginOutlined className="mr-1" /> Login
            </Link>
            <Link to="/register" className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
              <UserAddOutlined className="mr-1" /> Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <Button
          type="text"
          icon={isOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col gap-4 md:hidden text-gray-700 font-medium">
          {navItems.map(({ to, label, icon }) => (
            <Link key={label} to={to} onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-blue-600 transition">
              {icon}
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <span className="text-sm font-medium">👋 {user.full_name?.split(" ")[0] || "User"}</span>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Dashboard
              </Link>
              <Link to="/dashboard/profile" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Profile
              </Link>
              <Button type="link" onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
              }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <LoginOutlined className="mr-1" /> Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
                <UserAddOutlined className="mr-1" /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;