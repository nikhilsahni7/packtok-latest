import { Role } from "@packtok/db";
import { Router } from "express";
import {
  createPodcastHandler,
  createSeriesHandler,
  deletePodcastHandler,
  deleteSeriesHandler,
  getPodcast,
  listPodcasts,
  listSeriesHandler,
  retryUploadHandler,
  updatePodcastHandler,
  updateSeriesHandler,
} from "../controllers/admin.podcast.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { hasRole } from "../middlewares/roles.middleware";
import {
  podcastMediaUpload,
  seriesCoverUpload,
} from "../middlewares/upload.middleware";

const router = Router();

// All routes require admin authentication
router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));

// ===== Podcast CRUD =====
router.get("/", listPodcasts);
router.post("/", podcastMediaUpload, createPodcastHandler);
router.get("/series", listSeriesHandler);
router.post("/series", seriesCoverUpload, createSeriesHandler);
router.patch("/series/:id", seriesCoverUpload, updateSeriesHandler);
router.delete("/series/:id", deleteSeriesHandler);

router.get("/:id", getPodcast);
router.patch("/:id", podcastMediaUpload, updatePodcastHandler);
router.delete("/:id", deletePodcastHandler);
router.post("/:id/retry-upload", podcastMediaUpload, retryUploadHandler);

export default router;
