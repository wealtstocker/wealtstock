import React, { useState } from 'react';

const AddFundPage = () => {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleScreenshotUpload = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!amount || !utr || !screenshot) {
      alert('Please complete all fields.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold text-red-600 mb-2">Pay-In</h2>

      <div className="text-center mb-6">
        <img
          src="/your-qr-code.png"
          alt="UPI QR Code"
          className="w-32 h-32 mx-auto"
        />
        <p className="mt-2 text-sm">UPI ID: <strong>brokingfirm081-2@okaxis</strong></p>
        <p className="text-xs text-gray-600">Scan the QR and make a payment.</p>
      </div>

      {!submitted ? (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter deposit amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">UTR / UPI Reference Number</label>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter UPI Ref. Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Attach Payment Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleScreenshotUpload}
              className="mt-1"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit This Form After UPI Payment
          </button>
        </form>
      ) : (
        <div className="text-center text-green-700 font-semibold">
          ✅ Thank you! Your request has been submitted. Verification will be completed within 15 minutes.
        </div>
      )}
    </div>
  );
};

export default AddFundPage;
