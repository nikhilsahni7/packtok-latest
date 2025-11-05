import { Router } from "express";
import {
  createUserAddress,
  deleteUserAddress,
  getAddressDetails,
  getMyAddresses,
  setAddressAsDefault,
  updateUserAddress,
} from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.post("/", authMiddleware, createUserAddress);
router.get("/", authMiddleware, getMyAddresses);
router.get("/:id", authMiddleware, getAddressDetails);
router.put("/:id", authMiddleware, updateUserAddress);
router.delete("/:id", authMiddleware, deleteUserAddress);
router.patch("/:id/set-default", authMiddleware, setAddressAsDefault);

export default router;
