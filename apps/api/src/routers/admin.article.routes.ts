import { Role } from "@packtok/db";
import { Router } from "express";
import {
  adminCreateArticle,
  adminDeleteArticle,
  adminGetArticle,
  adminListArticles,
  adminUpdateArticle,
} from "../controllers/admin.article.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { articleCoverUpload } from "../middlewares/upload.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));

router.get("/", adminListArticles);
router.post("/", articleCoverUpload, adminCreateArticle);
router.get("/:id", adminGetArticle);
router.patch("/:id", articleCoverUpload, adminUpdateArticle);
router.delete("/:id", adminDeleteArticle);

export default router;
