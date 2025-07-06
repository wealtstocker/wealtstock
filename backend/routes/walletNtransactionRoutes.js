import express from "express";
import {
  topUpWallet,
  checkBalance,
  getAllUserBalances,
  requestWithdrawal,
  getMyWithdrawals,
  getPendingWithdrawals,
  addFundRequest,
  approveFundRequest,
  rejectFundRequest,
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

// Customer Routes
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

// Admin Routes
router.post(
  "/approve-fund-request/:requestId",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  approveFundRequest
);
router.post(
  "/reject-fund-request/:requestId",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  rejectFundRequest
);
router.post(
  "/payout/:requestId",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  payout
);
router.get(
  "/admin/fund-requests",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getAllFundRequests
);
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
router.get(
  "/all-balances",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getAllUserBalances
);
router.get(
  "/all-transactions",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getAllTransactions
);
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