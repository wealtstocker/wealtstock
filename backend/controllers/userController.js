import pool from "../config/db.js";

export async function getAllUsers(req, res) {
  try {
    const [users] = await pool.query(
      "SELECT id, username, email, role FROM users"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function updateUserRole(req, res) {
  const { id, role } = req.body;
  if (!id || !role) {
    return res.status(400).json({ message: "User ID and role are required" });
  }
  if (!["user", "admin", "superadmin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  try {
    const [result] = await pool.query(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User role updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
