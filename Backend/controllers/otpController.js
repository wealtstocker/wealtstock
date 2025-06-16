import { sendSMS, verifyOtp, clearOtp, saveOtp } from "../utils/otp.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export async function sendOtp(req, res) {
  const { phone_number } = req.body;
  if (!phone_number) return res.status(400).json({ message: "Phone number is required" });

  const otp = generateOTP();

  try {
    await sendSMS(phone_number, `Your OTP to login on matkabazar is: ${otp}. Valid for 2 minutes only.`);
    saveOtp(phone_number, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
}

export async function verifyOtpHandler(req, res) {
  const { phone_number, otp } = req.body;
  if (!phone_number || !otp) {
    return res.status(400).json({ message: "Phone number and OTP are required" });
  }

  const isValid = verifyOtp(phone_number, otp);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  clearOtp(phone_number);
  res.status(200).json({ message: "OTP verified successfully" });
}
