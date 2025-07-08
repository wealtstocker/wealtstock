import pool from "../config/db.js";

// ✅ Convert uploaded file to full URL
const getFileUrl = (req, field) => {
  return req.files?.[field]?.[0]?.path || null;
};
// ✅ GET site config
export const getSiteConfig = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM site_config LIMIT 1");
    res.json({ message: "Success", data: rows[0] || null });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch config", error: error.message });
  }
};

// ✅ CREATE site config
export const createSiteConfig = async (req, res) => {
  const {
    site_name,
    upi_id,
    support_email,
    support_phone,
    support_info,
    address,
  } = req.body;

  const qr_image_url = getFileUrl(req, "qr_image");
  const logo_url = getFileUrl(req, "logo");

  if (!upi_id || !site_name || !qr_image_url) {
    return res
      .status(400)
      .json({ message: "UPI ID, site name, and QR image are required" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT COUNT(*) as count FROM site_config"
    );
    if (existing[0].count > 0) {
      return res
        .status(400)
        .json({ message: "Site configuration already exists" });
    }

    const [result] = await pool.query(
      `INSERT INTO site_config (
        site_name, upi_id, qr_image_url, logo_url, support_email,
        support_phone, support_info, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        site_name,
        upi_id,
        qr_image_url,
        logo_url,
        support_email,
        support_phone,
        support_info,
        address,
      ]
    );

    const [newConfig] = await pool.query(
      "SELECT * FROM site_config WHERE id = ?",
      [result.insertId]
    );
    res
      .status(201)
      .json({ message: "Created successfully", data: newConfig[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create config", error: error.message });
  }
};

// ✅ UPDATE site config
export const updateSiteConfig = async (req, res) => {
  const { id } = req.params;
  const {
    site_name,
    upi_id,
    support_email,
    support_phone,
    support_info,
    address,
  } = req.body;

  const qr_image_url = getFileUrl(req, "qr_image");
  const logo_url = getFileUrl(req, "logo");

  try {
    const [existing] = await pool.query(
      "SELECT * FROM site_config WHERE id = ?",
      [id]
    );
    if (!existing[0]) {
      return res.status(404).json({ message: "Config not found" });
    }

    const fields = [];
    const values = [];

    if (site_name) fields.push("site_name = ?"), values.push(site_name);
    if (upi_id) fields.push("upi_id = ?"), values.push(upi_id);
    if (support_email)
      fields.push("support_email = ?"), values.push(support_email);
    if (support_phone)
      fields.push("support_phone = ?"), values.push(support_phone);
    if (support_info)
      fields.push("support_info = ?"), values.push(support_info);
    if (address) fields.push("address = ?"), values.push(address);
    if (qr_image_url)
      fields.push("qr_image_url = ?"), values.push(qr_image_url);
    if (logo_url) fields.push("logo_url = ?"), values.push(logo_url);

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    await pool.query(
      `UPDATE site_config SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const [updatedConfig] = await pool.query(
      "SELECT * FROM site_config WHERE id = ?",
      [id]
    );
    res.json({ message: "Updated successfully", data: updatedConfig[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update config", error: error.message });
  }
};

// ✅ DELETE site config
export const deleteSiteConfig = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.query(
      "SELECT id FROM site_config WHERE id = ?",
      [id]
    );
    if (!existing[0]) {
      return res.status(404).json({ message: "Config not found" });
    }

    await pool.query("DELETE FROM site_config WHERE id = ?", [id]);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete config", error: error.message });
  }
};
