import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import Logo from "../assets/logon.jfif";

// Icons
import {
  FaHome,
  FaInfoCircle,
  FaServicestack,
  FaPhoneAlt,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";

const Navbar = () => {
  const navRef = useRef();
  const mobileMenuRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -100,
      duration: 1,
      ease: "bounce.out",
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const hoverAnim = (target) => {
    gsap.to(target, {
      x: 5,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const leaveAnim = (target) => {
    gsap.to(target, {
      x: 0,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const navItems = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/about", label: "About", icon: <FaInfoCircle /> },
    { to: "/services", label: "Services", icon: <FaServicestack /> },
    { to: "/contact", label: "Contact", icon: <FaPhoneAlt /> },
  ];

  return (
    <nav
      ref={navRef}
      className="bg-white shadow-md p-4 fixed w-full z-50 flex items-center justify-between"
    >
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <img src={Logo} title="finance market" alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Center: Nav Links - Desktop */}
      <ul className="hidden md:flex flex-1 justify-center gap-6 text-gray-700 font-medium">
        {navItems.map(({ to, label, icon }) => (
          <li key={label}>
            <Link
              to={to}
              className="flex items-center gap-2 hover:text-blue-600 transition"
              onMouseEnter={(e) => hoverAnim(e.currentTarget)}
              onMouseLeave={(e) => leaveAnim(e.currentTarget)}
            >
              {icon}
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right: Login and Registration Buttons */}
      <div className="hidden md:flex gap-4">
        <Link
          to="/login"
          title="Login to access ..."
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 "
        >
          <FaSignInAlt className="inline mr-1" />
          Login
        </Link>
        <Link
          to="/register"
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-red-500 transition duration-300 transform hover:scale-105"
        >
         <FaUserPlus className="inline mr-1" />
          New Registration
        </Link>
      </div>

      {/* Hamburger Icon - Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col items-start gap-4 md:hidden text-gray-700 font-medium"
        >
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 hover:text-blue-600 transition"
            >
              {icon}
              {label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-red-500 transition duration-300 transform hover:scale-105"
          >
            <FaSignInAlt />
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-red-500 transition duration-300 transform hover:scale-105"
          >
            <FaUserPlus />
            New Registration
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
