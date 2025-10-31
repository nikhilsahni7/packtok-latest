import { prisma, Role } from "@packtok/db";
import { Request, Response } from "express";
import config from "../config";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  resetPasswordWithOtp,
  sendPasswordResetOtp,
  verifyOtp,
} from "../services/auth.service";
import { applyForVendor } from "../services/vendor.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone_number,
    country,
    password,
    asVendor,
    vendorCompanyName,
    vendorNotes,
  } = req.body;
  const user = await registerUser({
    name,
    email,
    phone_number,
    country,
    password,
  });

  // Optional vendor application inline during signup
  if (asVendor) {
    await applyForVendor(user.id, vendorCompanyName, vendorNotes);
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { id: user.id, email: user.email },
        asVendor
          ? "User registered. OTP sent. Vendor application created and pending admin approval."
          : "User registered. Please check your email for the OTP verification code."
      )
    );
});

export const signupVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, phone_number, country, password, companyName, notes } =
      req.body;
    const user = await registerUser({
      name,
      email,
      phone_number,
      country,
      password,
    });
    await applyForVendor(user.id, companyName, notes);
    // Immediately set role to VENDOR for vendor signup
    await prisma.user.update({
      where: { id: user.id },
      data: { role: Role.VENDOR },
    });
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: user.id, email: user.email },
          "User registered as vendor. OTP sent. Vendor application created and pending admin approval."
        )
      );
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await loginUser(email, password);

  // Enforce role routing: Vendors must use vendor login; allow Admins/Super Admins here
  if (user.role === Role.VENDOR) {
    throw new ApiError(
      403,
      "Invalid role for these credentials. Please use vendor sign-in."
    );
  }

  const options = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax" as const,
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, user },
        "Login successful"
      )
    );
});

export const loginVendor = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await loginUser(email, password);

  // Enforce role: only VENDOR can use vendor login (regardless of application status)
  if (user.role !== Role.VENDOR) {
    throw new ApiError(
      403,
      "Invalid role for these credentials. Please use normal sign-in."
    );
  }

  const options = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax" as const,
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, user },
        "Vendor login successful"
      )
    );
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const { accessToken, refreshToken } =
    await refreshAccessToken(incomingRefreshToken);

  const options = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax" as const,
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed")
    );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // For Supabase-managed sessions, removing the refresh token on the client is sufficient

  const options = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax" as const,
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
  };

  res
    .status(200)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "Logout successful"));
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    // The user object is attached by the authMiddleware
    res
      .status(200)
      .json(
        new ApiResponse(200, req.user, "Current user data fetched successfully")
      );
  }
);

export const verifyUserOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await verifyOtp(email, otp);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Email verified successfully."));
  }
);

export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await sendPasswordResetOtp(email);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset OTP sent."));
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    await resetPasswordWithOtp(email, otp, newPassword);
    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Password has been reset successfully.")
      );
  }
);
