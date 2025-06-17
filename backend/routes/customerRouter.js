import express from "express";
import {
  activateCustomer,
  addBankAccount,
  updateBankAccount,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Customer CRUD
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.put("/activate/:id", activateCustomer);

// 🔐 Bank Account
router.post("/add-bank", authenticate, addBankAccount); // ✅ Add bank account
router.put("/update-bank/:bankId", authenticate, updateBankAccount); // ✅ Update bank account

export default router;
