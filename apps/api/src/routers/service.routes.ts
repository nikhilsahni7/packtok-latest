import { Router } from "express";
import {
    cancelMyServiceRequest,
    getMyServiceRequestDetails,
    listMyServiceRequests,
    submitAcquisition,
    submitConsultancy,
    submitJobSeeker,
    submitMaintenance,
    submitManpower,
    submitTurnkey,
} from "../controllers/service.user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { cvUpload } from "../middlewares/upload.middleware";

const router = Router();

// User submits various service requests
router.post("/maintenance", authMiddleware, submitMaintenance);
router.post("/consultancy", authMiddleware, submitConsultancy);
router.post("/turnkey-project", authMiddleware, submitTurnkey);
router.post("/company-acquisition", authMiddleware, submitAcquisition);
router.post("/manpower-hiring", authMiddleware, submitManpower);
router.post("/jobseeker", authMiddleware, cvUpload, submitJobSeeker);

router.get("/my", authMiddleware, listMyServiceRequests);
router.get("/:id", authMiddleware, getMyServiceRequestDetails);
router.put("/:id/cancel", authMiddleware, cancelMyServiceRequest);

export default router;
