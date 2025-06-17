import twilio from "twilio";
import NodeCache from "node-cache";

const otpCache = new NodeCache({ stdTTL: 120 }); // TTL: 2 minutes
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(to, message) {
  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to,
  });
}

export function saveOtp(phone, otp) {
  otpCache.set(phone, otp);
}

export function verifyOtp(phone, inputOtp) {
  const savedOtp = otpCache.get(phone);

  return savedOtp && savedOtp == inputOtp;
}

export function clearOtp(phone) {
  otpCache.del(phone);
}
