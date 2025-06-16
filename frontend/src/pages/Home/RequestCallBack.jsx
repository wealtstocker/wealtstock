import React, { useState } from 'react';
import Swal from 'sweetalert2';

const RequestCallBack = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, inquiryType } = formData;

    if (!name || !email || !phone || !inquiryType) {
      Swal.fire({
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonColor: '#e11d48',
      });
      return;
    }

    // TODO: Replace this with your actual form submission logic (API call etc.)
    Swal.fire({
      title: 'Request Submitted!',
      text: 'Our team will contact you shortly.',
      icon: 'success',
      confirmButtonColor: '#10b981',
    });

    // Clear form
    setFormData({ name: '', email: '', phone: '', inquiryType: '' });
  };

  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Request A Free Call Back.</h2>
        <p className="text-gray-400 max-w-3xl mx-auto mb-10">
          Our platform values your engagement and the opportunity to assist you. 
          If you have any questions, concerns, or feedback, we’re here to help.
        </p>

        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-2xl shadow-lg grid lg:grid-cols-4 gap-4 text-gray-900"
        >
          <input
            type="text"
            name="name"
            placeholder="First name*"
            value={formData.name}
            onChange={handleChange}
            className="rounded-lg px-4 py-3 border focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={formData.email}
            onChange={handleChange}
            className="rounded-lg px-4 py-3 border focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone*"
            value={formData.phone}
            onChange={handleChange}
            className="rounded-lg px-4 py-3 border focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="rounded-lg px-4 py-3 border focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Inquiry Type</option>
            <option>Open Your Demat Account</option>
            <option>Trading & Investment Enquiry</option>
            <option>Flexibility & Transparency</option>
            <option>Services</option>
          </select>

          <button
            type="submit"
            className="col-span-full bg-gradient-to-r from-slate-700 via-gray-500 to-red-500  hover:from-red-500 hover:to-slate-600 transition duration-300 text-white font-semibold py-3 px-6 rounded-full "
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default RequestCallBack;
