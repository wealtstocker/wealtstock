import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 1010;

async function startServer() {
  try {
    await pool.getConnection();
    console.log("MySQL DB connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed ❌", err.message);
    process.exit(1);
  }
}

startServer();
