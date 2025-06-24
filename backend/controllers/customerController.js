import pool from "../config/db.js";
import { sendSMS, sendWhatsAppMessage } from "../utils/twilioService.js";

export async function getAllCustomers(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM customers ORDER BY created_at DESC");
    res.json({ status: true, customers: rows });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching customers", error: err.message });
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ status: false, message: "Customer not found" });
    res.json({ status: true, customer: rows[0] });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching customer", error: err.message });
  }
}

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
        id,
         is_active
      ]
    );
    res.json({ status: true, message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Error updating customer', error: err.message });
  }
}


export async function deleteCustomer(req, res) {
  const { id } = req.params;
  try {
    await pool.query("UPDATE customers SET is_active = false WHERE id = ?", [id]);
    res.json({ status: true, message: "Customer deactivated" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error deleting customer", error: err.message });
  }
}


export async function activateCustomer(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Customer not found" });
    }

    const customer = rows[0];
    await pool.query("UPDATE customers SET is_active = true WHERE id = ?", [id]);

    // Credentials to send
    const credentials = `Your Account has been activated.\nLogin ID: ${customer.email}\nPassword: ${customer.password_hash}`;

    // ✅ Send SMS
    console.log(customer)
    await sendSMS(customer.phone_number, credentials);

    // ✅ Optional: Send WhatsApp
    // await sendWhatsAppMessage(customer.phone_number, credentials);

    res.json({ status: true, message: "Customer activated and notified successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error activating customer", error: err.message });
  }
}

export async function changePassword(req, res) {
  const customerId = req.user.id; 
  const { current_password, new_password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [customerId]);
    if (!rows.length) return res.status(404).json({ message: "Customer not found" });

    const customer = rows[0];

   
    
    if (current_password !== customer.password_hash) {
      return res.status(401).json({ status: false,  message: "Current password is incorrect"});
    }

    const newHash = new_password;
    await pool.query("UPDATE customers SET password_hash = ? WHERE id = ?", [newHash, customerId]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password", error: err.message });
  }
}

// 📁 Backend (controllers/bankController.js)


export async function addBankAccount(req, res) {
  const customerId = req.user.id;
  const { account_holder_name, bank_name, ifsc_code, account_number } = req.body;

  try {
    const [existing] = await pool.query(`SELECT * FROM customer_bank_accounts WHERE customer_id = ?`, [customerId]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Bank account already exists. Use update instead." });
    }

    await pool.query(
      `INSERT INTO customer_bank_accounts (customer_id, account_holder_name, bank_name, ifsc_code, account_number) VALUES (?, ?, ?, ?, ?)`,
      [customerId, account_holder_name, bank_name, ifsc_code, account_number]
    );

    res.status(201).json({ message: "✅ Bank account added successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error adding account", error: err.message });
  }
}

export async function updateBankAccount(req, res) {
  const customerId = req.user.id;
  const bankId = req.params.bankId;
  const { account_holder_name, bank_name, ifsc_code, account_number } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE customer_bank_accounts SET account_holder_name = ?, bank_name = ?, ifsc_code = ?, account_number = ? WHERE id = ? AND customer_id = ?`,
      [account_holder_name, bank_name, ifsc_code, account_number, bankId, customerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ Bank account not found or unauthorized" });
    }

    res.json({ message: "✅ Bank account updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating account", error: err.message });
  }
}

export async function BankAccount(req, res) {
  const customerId = req.user?.id;

  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized: Customer not found in token" });
  }

  try {
    const [accounts] = await pool.query(
      `SELECT id, account_holder_name, bank_name, ifsc_code, account_number, is_primary, is_verified, created_at, updated_at FROM customer_bank_accounts WHERE customer_id = ? ORDER BY is_primary DESC, created_at DESC`,
      [customerId]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ message: "No bank accounts found for this customer." });
    }

    res.json({ banks: accounts });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching bank accounts.", error: error.message });
  }
}

