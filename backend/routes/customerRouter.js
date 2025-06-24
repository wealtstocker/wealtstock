import express from "express";
import {
  activateCustomer,
  addBankAccount,
  updateBankAccount,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  // getMyBankAccounts,
  BankAccount,
} from "../controllers/customerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Customer CRUD
router.get("/", getAllCustomers);
router.get("/bank",authenticate, BankAccount);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.put("/activate/:id", activateCustomer);

router.post("/add-bank", authenticate, addBankAccount); 
router.put("/update-bank/:bankId", authenticate, updateBankAccount);
export default router;
