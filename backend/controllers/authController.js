// controllers/authController.js
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/token.js";
import { v4 as uuidv4 } from "uuid";
import { sendSMS, saveOtp, verifyOtp, clearOtp } from "../utils/otp.js";


export async function registerAdmin(req, res) {
  const {
    full_name,
    email,
    phone_number,
    password,
    confirm_password,
    role = "admin",
  } = req.body;

  if (!full_name || !email || !password || !confirm_password) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled" });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Admin already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10); // ✅ Secure hash
    const uuid = uuidv4();

    await pool.query(
      `INSERT INTO users (uuid, full_name, email, phone_number, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [uuid, full_name, email, phone_number, password_hash, role]
    );

    res.status(201).json({
      message: "Admin registered successfully",
      uuid,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


export async function loginAdmin(req, res) {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];

    // Check role
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    // Check activation
    if (admin.is_active === 0) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: admin.uuid,
      role: admin.role,
      email: admin.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        id: admin.uuid,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


export function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}

export async function registerCustomer(req, res) {
  const {
    full_name,
    email,
    phone_number,
    profile_image,
    gender,
    dob,
    aadhar_number,
    pan_number,
    state,
    account_type,
    city,
    password,
    confirm_password,
    address,
  } = req.body;
  // console.log(req.body);
  const document_url = req.file?.path || null;

  if (password !== confirm_password) {
    return res
      .status(400)
      .json({ status: false, message: "Passwords do not match" });
  }

  try {
    const [existing] = await pool.query(
      `SELECT * FROM customers WHERE email = ? OR phone_number = ? OR aadhar_number = ? OR pan_number = ?`,
      [email, phone_number, aadhar_number, pan_number]
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ status: false, message: "Customer already registered" });
    }

    // const password_hash = await bcrypt.hash(password, 10);
    const password_hash = password;
    const uuid = uuidv4();

    const [result] = await pool.query(
      `INSERT INTO customers 
      (uuid, full_name, email, phone_number, profile_image, gender, dob, aadhar_number, pan_number, state, account_type, city, password_hash, address, document_url, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        full_name,
        email,
        phone_number,
        profile_image,
        gender,
        dob,
        aadhar_number,
        pan_number,
        state,
        account_type,
        city,
        password_hash,
        address,
        document_url,
        0,
      ]
    );

    const customer_no = result.insertId;
    const custom_id = `GRP${(5000 + customer_no).toString().padStart(6, "0")}`;

    await pool.query(`UPDATE customers SET id = ? WHERE customer_no = ?`, [
      custom_id,
      customer_no,
    ]);

    res.status(201).json({
      status: true,
      message: "Customer registered successfully",
      customer_id: custom_id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
}

export async function loginCustomer(req, res) {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM customers WHERE email = ? OR id = ?`,
      [username, username]
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ status: false, message: "Customer not found" });
    }

    const customer = rows[0];

    // if (!customer.is_active) {
    //   return res.status(403).json({ status: false, message: "Account is inactive" });
    // }

    if (password !== customer.password_hash) {
      return res
        .status(401)
        .json({ status: false, message: "Incorrect password" });
    }

    const token = generateToken(customer);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      customer: {
        id: customer.id,
        full_name: customer.full_name,
        email: customer.email,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
}

export async function forgotPassword(req, res) {
  const { phone_number } = req.body;
  if (!phone_number)
    return res.status(400).json({ message: "Phone number is required" });

  try {
    const [users] = await pool.query(
      "SELECT * FROM customers WHERE phone_number = ?",
      [phone_number]
    );
    if (!users.length)
      return res.status(404).json({ message: "Customer not found" });

    const otp = generateOTP();
    await sendSMS(
      phone_number,
      `Your OTP to reset password is: ${otp}. Valid for 2 minutes.`
    );
    saveOtp(phone_number, otp);

    res.json({ message: "OTP sent to your phone number" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
}

export async function resetPassword(req, res) {
  const { phone_number, otp, new_password } = req.body;

  if (!verifyOtp(phone_number, otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    const password_hash = await bcrypt.hash(new_password, 10);
    await pool.query(
      "UPDATE customers SET password_hash = ? WHERE phone_number = ?",
      [password_hash, phone_number]
    );
    clearOtp(phone_number);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
