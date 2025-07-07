import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteConfig } from '../../../redux/Slices/siteConfigSlice';
import { Upload, Form, Button, Tooltip, Modal } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import toast from '../../Services/toast';

const AddFundPage = () => {
  const [form] = Form.useForm();
  const [screenshot, setScreenshot] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { config } = useSelector((state) => state.siteConfig);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(fetchSiteConfig());
  }, [dispatch]);

  const handleScreenshotUpload = (file) => {
    setScreenshot(file);
    setPreviewURL(URL.createObjectURL(file));
    return false; // prevent automatic upload
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
      const res = await axiosInstance.post("wallet/fund-request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      toast.success("Request submitted successfully!");
      setSubmitted(true);
      form.resetFields();
      setScreenshot(null);
      setPreviewURL(null);

      Modal.success({
        title: "Payment Submitted",
        content: "Thank you! Your request will be verified within 12–24 hours.",
        centered: true,
      });

    } catch (err) {
      console.error("❌ Error submitting request:", err);
      toast.error("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">💰 Fund Deposit (Pay-In)</h2>

      <div className="text-center mb-6">
        {config.data?.qr_image_url ? (
          <img
            src={config.data.qr_image_url}
            alt="UPI QR Code"
            className="w-36 h-36 mx-auto object-contain border rounded"
          />
        ) : (
          <div className="text-sm text-gray-500">QR Code not available</div>
        )}
        <p className="mt-3 text-sm">
          UPI ID: <strong className="text-blue-600">{config?.data?.upi_id || 'N/A'}</strong>
        </p>
        <p className="text-xs text-gray-600">Scan and pay before submitting this form.</p>
      </div>

      {!submitted ? (
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="space-y-2"
        >
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
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter deposit amount"
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                UTR / Reference Number&nbsp;
                <Tooltip title="Enter the transaction reference / UTR number shown after payment.">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            name="utr"
            rules={[{ required: true, message: "UTR/Ref number is required" }]}
          >
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter UPI Ref. Number"
            />
          </Form.Item>

          <Form.Item
            label="Attach Payment Screenshot"
            name="screenshot"
            rules={[{ required: true, message: "Upload a screenshot!" }]}
          >
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleScreenshotUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload Screenshot</Button>
            </Upload>
            {previewURL && (
              <div className="mt-2">
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-28 h-28 object-cover border rounded"
                />
              </div>
            )}
          </Form.Item>

          <Form.Item label="Note (Optional)" name="note">
            <textarea
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Any remarks or extra info"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            loading={loading}
          >
            {loading ? "Submitting..." : "Submit Fund Request"}
          </Button>
        </Form>
      ) : (
        <div className="text-center text-green-600 font-medium text-lg mt-4">
          ✅ Your fund request has been submitted.
          <br />
          Please wait while we verify the payment.
        </div>
      )}
    </div>
  );
};

export default AddFundPage;
