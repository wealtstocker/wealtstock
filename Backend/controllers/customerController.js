import pool from "../config/db.js";
import bcrypt from "bcryptjs";

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
  } = req.body;

  try {
    await pool.query(
      `UPDATE customers SET 
        full_name = ?, email = ?, phone_number = ?, gender = ?, dob = ?, 
        aadhar_number = ?, pan_number = ?, state = ?, account_type = ?, 
        city = ?, address = ?
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
      ]
    );
    res.json({ status: true, message: "Customer updated successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error updating customer", error: err.message });
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
    await pool.query("UPDATE customers SET is_active = true WHERE id = ?", [id]);
    res.json({ status: true, message: "Customer activated successfully" });
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

export async function addBankAccount(req, res) {
  const customerId = req.user.id;
  const {
     account_holder_name, bank_name,
    ifsc_code, account_number
  } = req.body;

  console.log("*************", account_holder_name, account_number);

  try {
    await pool.query(
      `INSERT INTO customer_bank_accounts 
      (customer_id,  account_holder_name, bank_name, ifsc_code, account_number)
      VALUES (?, ?, ?, ?, ?)`, // ✅ 6 placeholders
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
  const {
    account_type, account_holder_name, bank_name,
    ifsc_code, account_number
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE customer_bank_accounts
       SET account_type = ?, account_holder_name = ?, bank_name = ?, ifsc_code = ?, account_number = ?
       WHERE id = ? AND customer_id = ?`,  // ✅ Removed extra comma
      [account_type, account_holder_name, bank_name, ifsc_code, account_number, bankId, customerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ Bank account not found or unauthorized" });
    }

    res.json({ message: "✅ Bank account updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating account", error: err.message });
  }
}
