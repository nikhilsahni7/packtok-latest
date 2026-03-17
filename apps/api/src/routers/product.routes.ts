import { Router } from "express";
import {
  getMySubmissions,
  getProduct,
  listProducts,
  submitProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { productMediaUpload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", listProducts);
router.get("/my-submissions", authMiddleware, getMySubmissions);
router.get("/:id", getProduct);
router.post("/submit", authMiddleware, productMediaUpload, submitProduct);

export default router;
