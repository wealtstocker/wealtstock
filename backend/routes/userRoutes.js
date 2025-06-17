import express from "express";
import { getAllUsers, updateUserRole } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getAllUsers
);
router.patch(
  "/changerole",
  authenticate,
  authorizeRoles("superadmin"),
  updateUserRole
);

export default router;
