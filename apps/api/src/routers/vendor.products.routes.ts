import { Role } from "@packtok/db";
import { Router } from "express";
import {
  vendorAdjustInventory,
  vendorCreateDraft,
  vendorDeleteProduct,
  vendorGetInventory,
  vendorGetProduct,
  vendorListProducts,
  vendorRemoveGalleryImage,
  vendorSubmitForReview,
  vendorUpdateProduct,
  vendorUploadMedia,
  vendorUpsertInventory,
} from "../controllers/vendor.product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";
import { productMediaUpload } from "../middlewares/upload.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.VENDOR));

router.get("/", vendorListProducts);
router.post("/drafts", vendorCreateDraft);
router.get("/:id", vendorGetProduct);
router.patch("/:id", vendorUpdateProduct);
router.post("/:id/submit", vendorSubmitForReview);
router.delete("/:id", vendorDeleteProduct);

// Inventory endpoints
router.get("/:id/inventory", vendorGetInventory);
router.put("/:id/inventory", vendorUpsertInventory);
router.post("/:id/inventory/adjustments", vendorAdjustInventory);

// Media endpoints
router.post("/:id/media", productMediaUpload, vendorUploadMedia);
router.delete("/:id/media/image", vendorRemoveGalleryImage);

export default router;
