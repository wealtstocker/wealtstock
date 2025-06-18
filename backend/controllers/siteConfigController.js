// controllers/siteConfigController.js
import pool from "../config/db.js";

// Helper: convert uploaded file to full URL
const fileToUrl = (req, field) => {
  if (req.files && req.files[field] && req.files[field][0]) {
    return `${req.protocol}://${req.get("host")}/uploads/site/${req.files[field][0].filename}`;
  }
  return null;
};

// GET site config (return first row)
export const getSiteConfig = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM site_config LIMIT 1");
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ message: "Error fetching site config", error });
  }
};

// CREATE site config (with image upload)
export const createSiteConfig = async (req, res) => {
  const { site_name, upi_id, support_email, support_phone, address } = req.body;

  const qr_image_url = fileToUrl(req, "qr_image");
  const logo_url = fileToUrl(req, "logo");

  if (!upi_id || !qr_image_url) {
    return res.status(400).json({ message: "UPI ID and QR Image are required" });
  }

  try {
    await pool.query(
      `INSERT INTO site_config (
        site_name, upi_id, qr_image_url, logo_url, support_email, support_phone, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [site_name, upi_id, qr_image_url, logo_url, support_email, support_phone, address]
    );
    res.status(201).json({ message: "Site config created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating config", error });
  }
};

// UPDATE site config (partial update, including optional image)
export const updateSiteConfig = async (req, res) => {
  const { id } = req.params;
  const { site_name, upi_id, support_email, support_phone, address } = req.body;

  const qr_image_url = fileToUrl(req, "qr_image");
  const logo_url = fileToUrl(req, "logo");

  try {
    const fields = [];
    const values = [];

    if (site_name) fields.push("site_name = ?"), values.push(site_name);
    if (upi_id) fields.push("upi_id = ?"), values.push(upi_id);
    if (support_email) fields.push("support_email = ?"), values.push(support_email);
    if (support_phone) fields.push("support_phone = ?"), values.push(support_phone);
    if (address) fields.push("address = ?"), values.push(address);
    if (qr_image_url) fields.push("qr_image_url = ?"), values.push(qr_image_url);
    if (logo_url) fields.push("logo_url = ?"), values.push(logo_url);

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    const sql = `UPDATE site_config SET ${fields.join(", ")} WHERE id = ?`;

    await pool.query(sql, values);
    res.json({ message: "Site config updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating config", error });
  }
};

// DELETE site config
export const deleteSiteConfig = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM site_config WHERE id = ?", [id]);
    res.json({ message: "Site config deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting config", error });
  }
};
