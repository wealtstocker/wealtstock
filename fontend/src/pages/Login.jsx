import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import gsap from "gsap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import login from "../assets/login.jpg";

const LoginPage = () => {
  const formRef = useRef(null);
  const iconRefs = useRef([]);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Animate on mount
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
    const { username, password } = credentials;

    // Mock validation
    if (username === "demo_user" && password === "demo_pass") {
      toast.success("Login Successful!");
      // await Swal.fire("Welcome!", "You have successfully logged in.", "success");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
      Swal.fire("Oops!", "Invalid username or password", "error");
    }
  };

  const handleDemoLogin = () => {
    setCredentials({
      username: "demo_user",
      password: "demo_pass",
    });

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden bg-white">
        {/* Left Image Side */}
        <div className="md:w-1/2 hidden md:block">
          <img src={login} alt="Login" className="w-full h-full object-cover" />
        </div>

        {/* Right Form Side */}
        <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
          <div ref={formRef} className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text text-center">Login</h2>

            {/* Username Field */}
            <div className="mb-4 relative">
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div
                ref={(el) => (iconRefs.current[0] = el)}
                className="absolute left-4 top-2.5 text-blue-500 text-xl"
              >
                <FaUser />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6 relative">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div
                ref={(el) => (iconRefs.current[1] = el)}
                className="absolute left-4 top-2.5 text-blue-500 text-xl"
              >
                <FaLock />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Sign In
            </button>

            {/* Demo Login Button */}
            <button
              onClick={handleDemoLogin}
              className="w-full mt-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition duration-300"
            >
              Demo Login
            </button>

            {/* Bottom Links */}
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <a href="#" className="hover:underline">Forgot Password?</a>
              <a href="/register" className="hover:underline">Create Account</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;