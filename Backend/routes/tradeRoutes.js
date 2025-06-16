import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getUploadMiddleware } from "../utils/upload.js";
import { approveTrade, createTrade, deleteTrade, getAllTrades, getTradeById, updateTrade } from "../controllers/tradeController.js";
const router = express.Router();
const uploadScreenshot = getUploadMiddleware("screenshots");

router.post("/", authenticate,  createTrade);
router.get("/", authenticate, getAllTrades);
router.get("/:id", authenticate, getTradeById);
router.put("/:id",   updateTrade);
router.delete("/:id", authenticate, authorizeRoles("admin", "superadmin"), deleteTrade);
router.put("/:id/approve", authenticate, authorizeRoles("admin", "superadmin"), approveTrade);

export default router;
