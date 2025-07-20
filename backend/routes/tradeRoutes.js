import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  approveTrade,
  createTrade,
  deactivateTrade,
  deleteTrade,
  getAllTrades,
  getMyTrades,
  getTradeById,
  updateTrade,
  getMyTransactions,
} from "../controllers/tradeController.js";

const router = express.Router();

// Create a trade (accessible to authenticated customers and admins)
router.post("/", authenticate, createTrade);

// Get all trades (admin-only)
router.get("/", authenticate, authorizeRoles("admin", "superadmin"), getAllTrades);

// Get customer-specific trades (accessible to authenticated customers)
router.get("/my", authenticate, getMyTrades);

// Get customer-specific transactions (accessible to authenticated customers)
router.get("/my/transactions", authenticate, getMyTransactions);

// Get trade by ID (admin-only)
router.get("/:id", authenticate,  getTradeById);

// Update trade (admin-only)
router.put("/:id", authenticate, authorizeRoles("admin", "superadmin"), updateTrade);

// Delete trade (admin-only)
router.delete("/:id", authenticate, authorizeRoles("admin", "superadmin"), deleteTrade);

router.put("/approve/:id", authenticate, authorizeRoles("admin", "superadmin"), approveTrade);
router.put("/deactivate/:id", authenticate, authorizeRoles("admin", "superadmin"), deactivateTrade);

export default router;