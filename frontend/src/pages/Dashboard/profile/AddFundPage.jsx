import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteConfig } from '../../../redux/Slices/siteConfigSlice'
const AddFundPage = () => {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
 const dispatch = useDispatch();
  const { config } = useSelector((state) => state.siteConfig);
  const user = JSON.parse(localStorage.getItem("user")); 
 useEffect(() => {
    dispatch(fetchSiteConfig());
  }, [dispatch]);
  const handleScreenshotUpload = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return alert("Enter a valid amount greater than 0");
    }
    if (!utr.trim()) {
      return alert("Please enter UTR or reference number");
    }
    if (!screenshot) {
      return alert("Please upload the payment screenshot");
    }

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("utr_number", utr);
    formData.append("note", note);
    formData.append("method", "upi");
    formData.append("screenshot", screenshot);

    try {
      setLoading(true);

      const res = await axiosInstance.post("wallet/fund-request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log(res.data);
      setSubmitted(true);
      setAmount("");
      setUtr("");
      setScreenshot(null);
      setNote("");
    } catch (err) {
      console.error(err);
      alert("Error submitting fund request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold text-red-600 mb-2">Pay-In</h2>

     <div className="text-center mb-6">
          {config?.qr_image_url ? (
            <img
              src={config.qr_image_url}
              alt="UPI QR Code"
              className="w-32 h-32 mx-auto object-contain border"
            />
          ) : (
            <div className="text-sm text-gray-500">QR Code not available</div>
          )}

          <p className="mt-2 text-sm">
            UPI ID: <strong>{config?.upi_id || 'Not Available'}</strong>
          </p>
          <p className="text-xs text-gray-600">Scan the QR and make a payment.</p>
        </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter deposit amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              UTR / UPI Reference Number
            </label>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter UPI Ref. Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attach Payment Screenshot
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleScreenshotUpload}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Any remarks..."
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit This Form After UPI Payment"}
          </button>
        </form>
      ) : (
        <div className="text-center text-green-700 font-semibold mt-4">
          ✅ Thank you! Your request has been submitted.
          <br />
          Verification will be completed within 12-24 hour.
        </div>
      )}
    </div>
  );
};
export default AddFundPage;