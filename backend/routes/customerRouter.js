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
  deactivateCustomer,
} from "../controllers/customerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Customer CRUD
router.get("/", getAllCustomers);
router.get("/bank",authenticate, BankAccount);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.put("/deactivate/:id", deactivateCustomer);
router.put("/activate/:id", activateCustomer);
router.delete("/:id",authenticate,authorizeRoles("admin", "superadmin"), deleteCustomer);

router.post("/add-bank", authenticate, addBankAccount); 
router.put("/update-bank/:bankId", authenticate, updateBankAccount);
export default router;
