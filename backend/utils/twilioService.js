import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

// ✅ SMS Function
export async function sendSMS(phone, message) {
  try {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`; 
    console.log("----",formattedPhone)
    const response = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: formattedPhone,
    });
    console.log("📩 SMS sent:", response.sid);
    return response;
  } catch (error) {
    console.error("❌ SMS sending failed:", error.message);
    throw error;
  }
}


// ✅ WhatsApp Function
export async function sendWhatsAppMessage(phone, message) {
  try {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${formattedPhone}`,
    });
    console.log("📲 WhatsApp message sent:", response.sid);
    return response;
  } catch (error) {
    console.error("❌ WhatsApp sending failed:", error.message);
    throw error;
  }
}
