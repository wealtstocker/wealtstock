import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteConfig } from '../../../redux/Slices/siteConfigSlice';
import { Upload, Form, Button, Tooltip, Modal, Input } from 'antd';
import { UploadOutlined, InfoCircleOutlined, CopyOutlined } from '@ant-design/icons';
import toast from '../../Services/toast';
import { fetchWalletBalance } from '../../../redux/Slices/walletSlice';

const AddFundPage = () => {
  const [form] = Form.useForm();
  const [screenshot, setScreenshot] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { config } = useSelector((state) => state.siteConfig);
  const user = JSON.parse(localStorage.getItem("user"));
 
 const { balance, loading:bl } = useSelector((state) => state.wallet);


  useEffect(() => {
    dispatch(fetchWalletBalance()); 
    dispatch(fetchSiteConfig());
  }, [dispatch]);

  const handleScreenshotUpload = (file) => {
    setScreenshot(file);
    setPreviewURL(URL.createObjectURL(file));
    return false;
  };

  const handleSubmit = async (values) => {
    if (!screenshot) {
      toast.error("Please upload a payment screenshot.");
      return;
    }

    const formData = new FormData();
    formData.append("amount", values.amount);
    formData.append("utr_number", values.utr);
    formData.append("note", values.note || "");
    formData.append("method", "upi");
    formData.append("screenshot", screenshot);

    try {
      setLoading(true);
      await axiosInstance.post("wallet/fund-request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Request submitted successfully!");
      setSubmitted(true);
      form.resetFields();
      setScreenshot(null);
      setPreviewURL(null);

      Modal.success({
        title: "Payment Submitted",
        content: "✅ Thank you! Your request will be verified within 12–24 hours.",
        centered: true,
      });

    } catch (err) {
      console.error("❌ Error submitting request:", err);
      toast.error("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyUPI = () => {
    const upiID = config?.data?.upi_id;
    if (upiID) {
      navigator.clipboard.writeText(upiID);
      toast.success("UPI ID copied!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl sm:text-3xl font-semibold text-blue-700 mb-6 text-center">
        💳 Add Funds to Wallet
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Instructions */}
        <div className="bg-white shadow-md rounded-lg p-5 w-full lg:w-1/2">
          <div className="text-xl font-semibold mb-4 text-green-300">₹{bl ? "Loading..." : balance ?? "0.00"}</div>
          <div className="text-gray-600 text-sm mb-4 font-medium">STEPS TO ADD FUND</div>
          <ol className="text-sm text-gray-700 list-decimal pl-5 space-y-2">
            <li>Copy the UPI Address and make payment via PhonePe, Google Pay, etc.</li>
            <li>Take a screenshot and attach below with the amount you paid.</li>
            <li>Send the request; our team will verify the transaction.</li>
            <li>Once verified, your wallet balance will be updated.</li>
          </ol>

          {/* UPI Info */}
          <div className="mt-6">
            <div className="text-gray-700 font-semibold mb-1">UPI ID</div>
            <div className="flex items-center gap-2">
              <Input value={config?.data?.upi_id || "91728163813@yblg"} readOnly className="w-full" />
              <Button onClick={copyUPI} icon={<CopyOutlined />} />
            </div>
              <div className="text-center mb-6">
        {config && config?.data?.qr_image_url ? (
          <img
            src={config?.data.qr_image_url}
            alt="UPI QR Code"
            className="w-36 h-36 mx-auto object-contain border rounded"
          />
        ) : (
          <div className="text-sm text-gray-500">QR Code not available</div>
        )}
        </div>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="bg-white shadow-md rounded-lg p-5 w-full lg:w-1/2">
          {!submitted ? (
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              {/* Amount */}
              <Form.Item
                label="Amount (₹)"
                name="amount"
                rules={[
                  { required: true, message: "Amount is required" },
                  {
                    validator(_, value) {
                      if (value > 0) return Promise.resolve();
                      return Promise.reject("Enter a valid amount greater than 0");
                    },
                  },
                ]}
              >
                <Input type="number" placeholder="Enter deposit amount" />
              </Form.Item>

              {/* UTR / Ref No */}
              <Form.Item
                label={
                  <span>
                    UTR / Reference Number&nbsp;
                    <Tooltip title="Enter the UPI reference number from your payment app.">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="utr"
                rules={[{ required: true, message: "UTR/Ref number is required" }]}
              >
                <Input placeholder="e.g., 123456789XYZ" />
              </Form.Item>

              {/* Screenshot */}
              <Form.Item
                label="Upload Payment Screenshot"
                name="screenshot"
                rules={[{ required: true, message: "Upload a screenshot!" }]}
              >
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleScreenshotUpload}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload Screenshot</Button>
                </Upload>
                {previewURL && (
                  <img
                    src={previewURL}
                    alt="Screenshot Preview"
                    className="mt-2 w-28 h-28 object-cover border rounded"
                  />
                )}
              </Form.Item>

              {/* Optional Note */}
              <Form.Item name="note" label="Note (Optional)">
                <Input.TextArea rows={3} placeholder="Remarks or additional info" />
              </Form.Item>

              {/* Submit Button */}
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                loading={loading}
              >
                {loading ? "Submitting..." : "Add Now"}
              </Button>
            </Form>
          ) : (
            <div className="text-center text-green-600 font-medium text-lg mt-6">
              ✅ Fund request submitted. Please wait for verification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFundPage;
