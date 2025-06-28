import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import gsap from "gsap";
import Swal from "sweetalert2";
import { registerCustomer } from "../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ExtendedRegisterForm = () => {
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    gender: "",
    dob: "",
    aadhar_number: "",
    pan_number: "",
    state: "",
    account_type: "",
    city: "",
    password: "",
    confirm_password: "",
    address: "",
  });

  const [document, setDocument] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const validateForm = () => {
    for (let key in formData) {
      if (!formData[key]) {
        Swal.fire(
          "Validation Error",
          `Please fill out the ${key.replace("_", " ")} field.`,
          "error"
        );
        return false;
      }
    }
    if (formData.password !== formData.confirm_password) {
      Swal.fire("Validation Error", "Passwords do not match.", "error");
      return false;
    }
    if (!document) {
      Swal.fire(
        "Validation Error",
        "Please upload your Aadhar/PAN document.",
        "error"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    form.append("document", document);

    try {
      const res = await dispatch(registerCustomer(form)).unwrap();
      // console.log("response -------", res);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: res.message || "Registered successfully",
        text: "Your account will be verified within 24 hours. Please wait.",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        gender: "",
        dob: "",
        aadhar_number: "",
        pan_number: "",
        state: "",
        account_type: "",
        city: "",
        password: "",
        confirm_password: "",
        address: "",
      });
      setDocument(null);
      navigate("/");
    } catch (err) {
      console.error("axios error ", err);
      Swal.fire(
        "Error",
        err?.message || "Registration failed. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 flex items-center justify-center px-4 py-5">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text text-center mb-6"
        >
          Create Your Account
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "full_name", label: "Full Name", type: "text", placeholder: "John Doe" },
              { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
              { name: "phone_number", label: "Mobile Number", type: "tel", placeholder: "9876543210" },
              { name: "dob", label: "Date of Birth", type: "date" },
              { name: "aadhar_number", label: "Aadhar Number", type: "text", placeholder: "1234-5678-9012" },
              { name: "pan_number", label: "PAN Number", type: "text", placeholder: "ABCDE1234F" },
              { name: "city", label: "City", type: "text", placeholder: "Mumbai" },
              { name: "state", label: "State", type: "text", placeholder: "Maharashtra" },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-1 font-medium">
                  {label} *
                </label>
                <input
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder || `Enter your ${label}`}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block mb-1 font-medium">Password *</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                className="w-full border px-4 py-2 rounded-lg pr-10 focus:ring-2 focus:ring-blue-400"
              />
              <span
                className="absolute right-3 top-10 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="relative">
              <label className="block mb-1 font-medium">Confirm Password *</label>
              <input
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full border px-4 py-2 rounded-lg pr-10 focus:ring-2 focus:ring-blue-400"
              />
              <span
                className="absolute right-3 top-10 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Gender & Account Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Account Type *</label>
              <select
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Account Type</option>
                <option value="Demat">Demat Account</option>
                <option value="Trading">Trading Account</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-medium">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Flat No. / Street / Locality"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              rows="3"
            ></textarea>
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-1 font-medium">
              Upload Aadhar/PAN Document *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border px-4 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-blue-50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-4 text-white py-3 font-medium rounded-lg transition duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
          >
            {isSubmitting ? "Registering..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExtendedRegisterForm;
