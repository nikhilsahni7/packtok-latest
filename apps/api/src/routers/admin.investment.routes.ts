import { Role } from "@packtok/db";
import { Router } from "express";
import {
    adminCreateProperty,
    adminDeleteProperty,
    adminListProperties,
    adminListQueries,
    adminUpdateProperty,
    adminUpdateQueryStatus,
} from "../controllers/investment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { investmentPropertyImageUpload } from "../middlewares/investmentUpload.middleware";
import { hasRole } from "../middlewares/roles.middleware";

const router = Router();

router.use(authMiddleware, hasRole(Role.ADMIN, Role.SUPER_ADMIN));

// Properties CRUD
router.get("/", adminListProperties);
router.post("/", investmentPropertyImageUpload, adminCreateProperty);
router.put("/:id", investmentPropertyImageUpload, adminUpdateProperty);
router.delete("/:id", adminDeleteProperty);

// Queries management
router.get("/queries", adminListQueries);
router.put("/queries/:id", adminUpdateQueryStatus);

export default router;
