import { Router } from "express";
import {
  addCommentHandler,
  deleteCommentHandler,
  getCommentsHandler,
  getPodcast,
  getRepliesHandler,
  getSeriesHandler,
  listPodcasts,
  listSeriesHandler,
  reactToPodcast,
  updateCommentHandler,
} from "../controllers/podcast.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// ===== Public Podcast Endpoints =====
router.get("/", listPodcasts);
router.get("/series", listSeriesHandler);
router.get("/series/:id", getSeriesHandler);
router.get("/:id", getPodcast);

// ===== Authenticated Endpoints =====
router.post("/:id/react", authMiddleware, reactToPodcast);

// ===== Comment Endpoints =====
router.get("/:id/comments", getCommentsHandler);
router.post("/:id/comments", authMiddleware, addCommentHandler);
router.get("/comments/:commentId/replies", getRepliesHandler);
router.patch("/comments/:commentId", authMiddleware, updateCommentHandler);
router.put("/comments/:commentId", authMiddleware, updateCommentHandler);
router.delete("/comments/:commentId", authMiddleware, deleteCommentHandler);

export default router;
