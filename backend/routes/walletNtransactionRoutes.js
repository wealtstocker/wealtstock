import express from "express";
import {
  topUpWallet,
  checkBalance,
  getAllUserBalances,
  requestWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  // processWithdrawal,
  // getMyTransactions,
  // getAllTransactions,
  addFundRequest,
  approveFundRequest,
  updateFundRequestStatus,
  updateWithdrawalStatus,
  getMyWallet,
  getAllTransactions,
  getAllFundRequests,
  getMyFundRequests,
  getPendingFundRequests,
  getApprovedFundRequests,
  getAllWithdrawals,
  payout,
} from "../controllers/walletNtransactionController.js";

import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getUploadMiddleware } from "../utils/upload.js";

const router = express.Router();
const screenshotUpload = getUploadMiddleware("screenshots");

// Customer routes
router.post(
  "/fund-request",
  authenticate,
  screenshotUpload.single("screenshot"),
  addFundRequest
);
router.get("/fund-requests", authenticate, getMyFundRequests);

router.get("/balance", authenticate, checkBalance);
router.get("/my-withdrawals", authenticate, getMyWithdrawals);
router.post("/withdraw", authenticate, requestWithdrawal);
router.get("/wallet-history", authenticate, getMyWallet);
// router.get("/my-transactions", authenticate, getMyTransactions);

// Admin routes
router.post(
  "/approve-fund-request/:requestId",
  authenticate,
  approveFundRequest
);
router.post("/payout/:requestId", authenticate, payout);
router.get("/admin/fund-requests", getAllFundRequests);
router.get(
  "/fund-requests/pending",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getPendingFundRequests
);
router.get(
  "/fund-requests/approved",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getApprovedFundRequests
);

router.put(
  "/admin/topup",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  topUpWallet
);
// router.put("/process-withdrawal",  processWithdrawal);
router.get("/all-balances", getAllUserBalances);
router.get("/all-transactions", getAllTransactions);

router.get(
  "/pending-withdrawals",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getPendingWithdrawals
);
router.get(
  "/all-withdrawals",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getAllWithdrawals
);
router.patch(
  "/withdrawal/status",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  updateWithdrawalStatus
);

router.patch(
  "/fund-request/status",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  updateFundRequestStatus
);

export default router;
