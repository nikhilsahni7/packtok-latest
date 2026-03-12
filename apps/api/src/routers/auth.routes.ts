import { Router } from "express";
import {
    getCurrentUser,
    login,
    loginVendor,
    logout,
    refresh,
    requestPasswordReset,
    resendOtp,
    resetPassword,
    signup,
    signupVendor,
    updateUserProfile,
    verifyPasswordReset,
    verifyUserOtp,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { profileImageUpload } from "../middlewares/upload.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/signup-vendor", signupVendor);
router.post("/login", login);
router.post("/login-vendor", loginVendor);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/verify-otp", verifyUserOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password/request", requestPasswordReset);
router.post("/forgot-password/verify", verifyPasswordReset);
router.post("/forgot-password/confirm", resetPassword);

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, profileImageUpload, updateUserProfile);

export default router;
