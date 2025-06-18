import express from "express";
import {
  getSiteConfig,
  updateSiteConfig,
  createSiteConfig,
  deleteSiteConfig,
} from "../controllers/siteConfigController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getUploadMiddleware } from "../utils/upload.js";

const siteUpload = getUploadMiddleware("site");

const router = express.Router();

router.get("/", getSiteConfig);

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  siteUpload.fields([{ name: "qr_image" }, { name: "logo" }]),
  createSiteConfig
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  siteUpload.fields([{ name: "qr_image" }, { name: "logo" }]),
  updateSiteConfig
);

router.delete("/:id", authenticate, authorizeRoles("admin", "superadmin"), deleteSiteConfig);

export default router;
