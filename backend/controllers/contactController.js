// controllers/contactController.js
import pool from "../config/db.js"; // ✅ your db connection

// Contact Message
export const submitContactMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  await pool.query( // ✅ replaced db with pool
    'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
    [name, email, phone, message]
  );

  res.json({ success: true, message: 'Contact message sent.' });
};

export const getContactMessages = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC'); // ✅
  res.json(rows);
};

export const deleteContactMessage = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]); // ✅
  res.json({ success: true, message: 'Contact message deleted.' });
};

// Callback Request
export const submitCallbackRequest = async (req, res) => {
  const { name, email, phone, inquiry_type } = req.body;
  if (!name || !email || !phone || !inquiry_type) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  await pool.query( // ✅
    'INSERT INTO call_back_requests (name, email, phone, inquiry_type) VALUES (?, ?, ?, ?)',
    [name, email, phone, inquiry_type]
  );

  res.json({ success: true, message: 'Callback request submitted.' });
};

export const getCallbackRequests = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM call_back_requests ORDER BY created_at DESC'); // ✅
  res.json(rows);
};

export const deleteCallbackRequest = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM call_back_requests WHERE id = ?', [id]); // ✅
  res.json({ success: true, message: 'Callback request deleted.' });
};
