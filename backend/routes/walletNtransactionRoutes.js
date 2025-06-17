import express from "express";
import {
  topUpWallet,
  checkBalance,
  getAllUserBalances,
  requestWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  processWithdrawal,
  // getMyTransactions,
  // getAllTransactions,
  addFundRequest,
  approveFundRequest,
  updateFundRequestStatus,
  updateWithdrawalStatus,
  getMyWallet,
  getAllTransactions,
  getAllFundRequests,
} from "../controllers/walletNtransactionController.js";

import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getUploadMiddleware } from "../utils/upload.js";

const router = express.Router();
const screenshotUpload = getUploadMiddleware("screenshots");

  // Customer routes
  router.post("/fund-request", authenticate, screenshotUpload.single("screenshot"), addFundRequest);
  router.get("/balance", authenticate, checkBalance);
  router.get("/my-withdrawals", authenticate, getMyWithdrawals);
  router.post("/withdraw", authenticate, requestWithdrawal);
  router.get("/wallet-history", authenticate, getMyWallet);
  // router.get("/my-transactions", authenticate, getMyTransactions);


// Admin routes
router.post("/approve-fund-request/:requestId", approveFundRequest);

router.put("/admin/topup",  authenticate, authorizeRoles("admin", "superadmin") ,topUpWallet);
router.get("/all-users-balance", getAllUserBalances);
router.get("/pending-withdrawals", getPendingWithdrawals);
router.put("/process-withdrawal",  processWithdrawal);
router.get("/admin/all-transactions", getAllTransactions);

router.get("/admin/fund-requests", getAllFundRequests);
router.patch("/fund-request/status", authenticate, authorizeRoles("admin", "superadmin"), updateFundRequestStatus);
router.patch("/withdrawal/status",   updateWithdrawalStatus);

export default router;