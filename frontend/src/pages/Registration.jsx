import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import gsap from "gsap";
import Swal from "sweetalert2";
import { registerCustomer } from "../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";

const ExtendedRegisterForm = () => {
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    is_active: 1,
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
      console.log("response -------", res);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: res.message || "Registered successfully",
        showConfirmButton: false,
        timer: 4000,
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
        is_active: 1,
      });
      setDocument(null);
      navigate("/login");
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text text-center mb-6"
        >
          Create Your Account
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "full_name", label: "Full Name", type: "text" },
            { name: "email", label: "Email Address", type: "email" },
            { name: "phone_number", label: "Mobile Number", type: "tel" },
            { name: "dob", label: "DOB", type: "date" },
            { name: "aadhar_number", label: "Aadhar Number", type: "text" },
            { name: "pan_number", label: "PAN Number", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "password", label: "Password", type: "password" },
            {
              name: "confirm_password",
              label: "Confirm Password",
              type: "password",
            },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label} *</label>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter your ${label}`}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 font-medium">Select Gender *</label>
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
            <label className="block mb-1 font-medium">Select State *</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Select Account Type *
            </label>
            <select
              name="account_type"
              value={formData.account_type}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Account</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Your Address"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Upload Your Aadhar/PAN *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border px-4 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-blue-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-4 text-white py-2 rounded-lg transition duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
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
