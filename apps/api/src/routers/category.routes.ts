import { Role } from "@packtok/db";
import { Router } from "express";
import {
  addCategorySubcategory,
  getCategories,
  patchCategory,
  postCategory,
  removeCategory,
  removeCategorySubcategory,
  updateCategorySubcategories,
} from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.get("/", getCategories);
router.post("/", authMiddleware, /* any authenticated user */ postCategory);
router.patch(
  "/:id",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  patchCategory
);
router.delete(
  "/:id",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  removeCategory
);

// Subcategory management routes
router.post(
  "/:id/subcategories",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  addCategorySubcategory
);
router.delete(
  "/:id/subcategories",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  removeCategorySubcategory
);
router.put(
  "/:id/subcategories",
  authMiddleware,
  hasRole(Role.ADMIN, Role.SUPER_ADMIN),
  updateCategorySubcategories
);

export default router;
