import { Router } from "express";
import {
  getPublicArticle,
  listPublicArticles,
} from "../controllers/article.controller";

const router = Router();

router.get("/", listPublicArticles);
router.get("/:id", getPublicArticle);

export default router;
