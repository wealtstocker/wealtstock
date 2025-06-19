import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getUploadMiddleware } from "../utils/upload.js";
import {
  approveTrade,
  createTrade,
  deleteTrade,
  getAllTrades,
  getMyTrades,
  getTradeById,
  updateTrade,
} from "../controllers/tradeController.js";
const router = express.Router();
const uploadScreenshot = getUploadMiddleware("screenshots");

router.post("/", authenticate, createTrade);
router.get("/", authenticate, getAllTrades);
router.get("/my", authenticate, getMyTrades);
router.get("/:id", authenticate, getTradeById);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  updateTrade
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  deleteTrade
);
router.put("/approve/:id", approveTrade);

export default router;
