import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const ExtendedRegisterForm = () => {
  const formRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text text-center mb-6"
        >
          Create Your Account
        </h2>

        <form ref={formRef} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name *</label>
            <input
              type="text"
              placeholder="Enter first name"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email Address *</label>
            <input
              type="email"
              placeholder="Enter Your Valid Email ID"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mobile Number *</label>
            <input
              type="tel"
              placeholder="Enter Your Mobile Number"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Select Gender *</label>
            <select className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">DOB *</label>
            <input
              type="date"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Aadhar Number *</label>
            <input
              type="text"
              placeholder="Enter Your Aadhar Number"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">PAN Number *</label>
            <input
              type="text"
              placeholder="Enter Your PAN Number"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Select State *</label>
            <select className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400">
              <option>Select State</option>
              <option>Maharashtra</option>
              <option>Delhi</option>
              <option>Karnataka</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Select New Account *
            </label>
            <select className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400">
              <option>Select Account</option>
              <option>Savings</option>
              <option>Current</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Your City *</label>
            <input
              type="text"
              placeholder="Enter Your City Name"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password *</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm Password *</label>
            <input
              type="password"
              placeholder="Enter Your Confirm Password"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Address *</label>
            <textarea
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
              className="w-full border px-4 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-blue-50"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExtendedRegisterForm;
