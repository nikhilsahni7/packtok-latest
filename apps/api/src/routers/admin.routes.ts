import { Role } from "@packtok/db";
import { Router } from "express";
import { createAdmin } from "../controllers/admin.controller";
import {
    adminApproveSubmission,
    adminCreateProduct,
    adminDeleteProduct,
    adminGetPendingSubmissions,
    adminGetProduct,
    adminListProducts,
    adminRejectSubmission,
    adminUpdateProduct,
    adminUpdateProductStatus,
} from "../controllers/admin.product.controller";
import {
    adminGetQuotes,
    adminUpdateQuote,
} from "../controllers/admin.quote.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";
import { productMediaUpload } from "../middlewares/upload.middleware";

const router = Router();

router.post("/create", authMiddleware, hasRole(Role.SUPER_ADMIN), createAdmin);

router.get(
  "/products",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminListProducts
);
router.get(
  "/products/:id",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminGetProduct
);
router.post(
  "/products",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  productMediaUpload,
  adminCreateProduct
);
router.put(
  "/products/:id",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  productMediaUpload,
  adminUpdateProduct
);
router.put(
  "/products/:id/status",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminUpdateProductStatus
);
router.delete(
  "/products/:id",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminDeleteProduct
);

// Submissions moderation
router.get(
  "/submissions",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminGetPendingSubmissions
);
router.put(
  "/submissions/:id/approve",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminApproveSubmission
);
router.put(
  "/submissions/:id/reject",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminRejectSubmission
);

// Quotes
router.get(
  "/quotes",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminGetQuotes
);
router.put(
  "/quotes/:id",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  adminUpdateQuote
);

export default router;
