import React, { useEffect, useRef, useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import gsap from "gsap";
import Swal from "sweetalert2";

import loginImg from "../assets/login.jpg";
import { loginAdmin } from "../redux/Slices/authSlice";

const LoginPage = () => {
  const formRef = useRef(null);
  const iconRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      iconRefs.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.2,
        delay: 0.5,
      }
    );
  }, []);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleLogin = async () => {
  const { email, password } = credentials;
  if (!email || !password) {
    toast.error("Please fill in both fields");
    return;
  }

  try {
    const res = await dispatch(loginAdmin({ email, password })).unwrap();
    toast.success(res.message); 
    localStorage.setItem("admin", JSON.stringify(res.user));
    // console.log("login",res)
    navigate("/admin/dashboard");
  } catch (err) {
    console.error(err)
    toast.error(err.message || "Invalid credentials");
  }
};

  // const handleForgotPassword = async () => {
  //   const { value: phone } = await Swal.fire({
  //     title: "Forgot Password",
  //     input: "text",
  //     inputLabel: "Enter your phone number",
  //     inputPlaceholder: "e.g. 9876543210",
  //     showCancelButton: true,
  //     confirmButtonText: "Send OTP",
  //   });

  //   if (phone) {
  //     try {
  //       const response = await fetch(`/api/forgot-password`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ phone_number: phone }),
  //       });

  //       const data = await response.json();
  //       if (!response.ok) throw new Error(data.message);

  //       Swal.fire("OTP Sent", data.message, "success");
  //     } catch (err) {
  //       Swal.fire("Error", err.message, "error");
  //     }
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden bg-white">
        {/* Left Image */}
        <div className="md:w-1/2 hidden md:block">
          <img src={loginImg} alt="Login" className="w-full h-full object-cover" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
          <div ref={formRef} className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text text-center">
              Admin Login
            </h2>

            {/* Email */}
            <div className="mb-4 relative">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div ref={(el) => (iconRefs.current[0] = el)} className="absolute left-4 top-2.5 text-blue-500 text-xl">
                <FaUser />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-12 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div ref={(el) => (iconRefs.current[1] = el)} className="absolute left-4 top-2.5 text-blue-500 text-xl">
                <FaLock />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2.5 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
