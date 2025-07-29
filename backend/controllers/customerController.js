import pool from "../config/db.js";
import { sendSMS, sendWhatsAppMessage } from "../utils/twilioService.js";
import { sendEmail } from "./emailService.js";

// Fetch all customers from the database
export async function getAllCustomers(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );
    res.json({ status: true, customers: rows });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching customers",
      error: err.message,
    });
  }
}

// Fetch a single customer by ID
export async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
    if (!rows.length)
      return res
        .status(404)
        .json({ status: false, message: "Customer not found" });
    res.json({ status: true, customer: rows[0] });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching customer",
      error: err.message,
    });
  }
}

// Update customer details
export async function updateCustomer(req, res) {
  const { id } = req.params;
  const {
    full_name,
    email,
    phone_number,
    gender,
    dob,
    aadhar_number,
    pan_number,
    state,
    account_type,
    city,
    address,
    is_active,
  } = req.body;

  try {
    await pool.query(
      `UPDATE customers SET 
        full_name = ?, email = ?, phone_number = ?, gender = ?, dob = ?, 
        aadhar_number = ?, pan_number = ?, state = ?, account_type = ?, 
        city = ?, address = ?, is_active = ?
      WHERE id = ?`,
      [
        full_name,
        email,
        phone_number,
        gender,
        dob,
        aadhar_number,
        pan_number,
        state,
        account_type,
        city,
        address,
        is_active,
        id,
      ]
    );
    res.json({ status: true, message: "Customer updated successfully" });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error updating customer",
      error: err.message,
    });
  }
}

// Deactivate a customer (soft delete)
export async function deactivateCustomer(req, res) {
  const { id } = req.params;
  try {
    await pool.query("UPDATE customers SET is_active = false WHERE id = ?", [id]);
    res.json({ status: true, message: "Customer deactivated" });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deactivating customer",
      error: err.message,
    });
  }
}

// Activate a customer and send credentials via SMS and Email
export async function activateCustomer(req, res) {
  const { id } = req.params;
  try {
    // Verify customer exists
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Customer not found" });
    }

    const customer = rows[0];

    // Update customer status to active
    await pool.query("UPDATE customers SET is_active = true WHERE id = ?", [id]);

    // Prepare credentials for SMS
    const credentials = `Your WealthStockResearch account is now active.\nLogin ID: ${customer.id}\nPassword: ${customer.password_hash}`;
    // await sendSMS(customer.phone_number, credentials);

    // Prepare email content
   const emailContent = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://wealthstockresearch.com/logo.png" alt="WealthStockResearch Logo" style="max-height: 60px;" />
      <h1 style="color: #004085; margin-top: 10px;">Welcome to WealthStockResearch</h1>
      <p style="color: #666; font-size: 16px;">Empowering Investors, Building Futures</p>
    </div>

    <p style="font-size: 16px; color: #333;">Dear <strong>${customer.full_name}</strong>,</p>

    <p style="font-size: 16px; color: #333;">
      We are thrilled to welcome you to <strong>WealthStockResearch</strong>, one of the most trusted and fastest-growing investment research firms globally.
      Your account has been successfully activated, and you're now part of an exclusive network of serious investors and market analysts.
    </p>

    <p style="font-size: 16px; color: #333;">
      Below are your secure login credentials:
    </p>

    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a73e8;">
      <p style="font-size: 16px; margin: 0;"><strong>Login ID:</strong> ${customer.id}</p>
      <p style="font-size: 16px; margin: 8px 0 0;"><strong>Password:</strong> ${customer.password_hash}</p>
    </div>

    <p style="font-size: 16px; color: #333;">
      Please store these credentials safely. Do not share your login details with anyone. You can access your account anytime at:
      <br/>
      <a href="https://wealtstockresearch.com" style="color: #1a73e8; text-decoration: none; font-weight: bold;">https://wealthstockresearch.com</a>
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

    <h3 style="color: #004085;">Why Choose WealthStockResearch?</h3>
    <ul style="font-size: 15px; color: #444; line-height: 1.6;">
      <li>✅ Trusted by 10,000+ investors globally</li>
      <li>📊 In-depth market analysis & expert insights</li>
      <li>🔐 100% secure and confidential account handling</li>
      <li>📞 Dedicated support team for all your needs</li>
    </ul>

    <p style="font-size: 16px; color: #333;">
      Our mission is to help you make informed financial decisions with confidence. Let’s achieve success together!
    </p>

    <div style="margin-top: 30px; text-align: center;">
      <a href="https://wealtstockresearch.com/login" style="background-color: #1a73e8; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px;">🔐 Login to Your Account</a>
    </div>

    <p style="font-size: 14px; color: #777; margin-top: 40px;">
      If you have any questions, feel free to contact our support team at 
      <a href="mailto:support@wealthstockresearch.com" style="color: #1a73e8;">support@wealthstockresearch.com</a>.
    </p>

    <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
      © ${new Date().getFullYear()} WealthStockResearch Pvt. Ltd. All rights reserved.<br/>
      Registered under SEBI (INH000000XXX) | Confidential & Secure Platform
    </p>
  </div>
`;


    // Send email to customer
    await sendEmail({
      to: customer.email,
      subject: 'Your WealthStockResearch Account is Now Active',
      html: emailContent,
    });

    res.json({
      status: true,
      message: "Customer activated and credentials sent via SMS and Email.",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error activating customer",
      error: err.message,
    });
  }
}

// Delete a customer permanently
export async function deleteCustomer(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM customers WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Customer not found" });
    }
    res.json({ status: true, message: "Customer permanently deleted" });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error deleting customer",
      error: err.message,
    });
  }
}

// Change customer password
export async function changePassword(req, res) {
  const customerId = req.user.id;
  const { current_password, new_password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [
      customerId,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "Customer not found" });

    const customer = rows[0];

    if (current_password !== customer.password_hash) {
      return res
        .status(401)
        .json({ status: false, message: "Current password is incorrect" });
    }

    const newHash = new_password;
    await pool.query("UPDATE customers SET password_hash = ? WHERE id = ?", [
      newHash,
      customerId,
    ]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error changing password", error: err.message });
  }
}

// Add a bank account for a customer
export async function addBankAccount(req, res) {
  const customerId = req.user.id;
  const { account_holder_name, bank_name, ifsc_code, account_number } = req.body;

  try {
    const [existing] = await pool.query(
      `SELECT * FROM customer_bank_accounts WHERE customer_id = ?`,
      [customerId]
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Bank account already exists. Use update instead." });
    }

    await pool.query(
      `INSERT INTO customer_bank_accounts (customer_id, account_holder_name, bank_name, ifsc_code, account_number) VALUES (?, ?, ?, ?, ?)`,
      [customerId, account_holder_name, bank_name, ifsc_code, account_number]
    );

    res.status(201).json({ message: "✅ Bank account added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error adding account", error: err.message });
  }
}

// Update a customer's bank account
export async function updateBankAccount(req, res) {
  const customerId = req.user.id;
  const bankId = req.params.bankId;
  const { account_holder_name, bank_name, ifsc_code, account_number } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE customer_bank_accounts SET account_holder_name = ?, bank_name = ?, ifsc_code = ?, account_number = ? WHERE id = ? AND customer_id = ?`,
      [
        account_holder_name,
        bank_name,
        ifsc_code,
        account_number,
        bankId,
        customerId,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "❌ Bank account not found or unauthorized" });
    }

    res.json({ message: "✅ Bank account updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Error updating account", error: err.message });
  }
}

// Fetch customer's bank accounts
export async function BankAccount(req, res) {
  const customerId = req.user?.id;

  if (!customerId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Customer not found in token" });
  }

  try {
    const [accounts] = await pool.query(
      `SELECT id, account_holder_name, bank_name, ifsc_code, account_number, is_primary, is_verified, created_at, updated_at FROM customer_bank_accounts WHERE customer_id = ? ORDER BY is_primary DESC, created_at DESC`,
      [customerId]
    );

    if (accounts.length === 0) {
      return res
        .status(404)
        .json({ message: "No bank accounts found for this customer." });
    }

    res.json({ banks: accounts });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching bank accounts.",
      error: error.message,
    });
  }
}