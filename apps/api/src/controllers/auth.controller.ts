import { prisma, Role } from "@packtok/db";
import { Request, Response } from "express";
import config from "../config";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  resetPasswordWithOtp,
  sendPasswordResetOtp,
  sendVerificationOtp,
  verifyOtp,
  verifyPasswordResetOtp,
} from "../services/auth.service";

import { applyForVendor } from "../services/vendor.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadImageToSupabase } from "../utils/storage.service";

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
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const user = await registerUser({
    name,
    email: String(email).trim().toLowerCase(),
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
    if (!name || !email || !password || !companyName) {
      throw new ApiError(
        400,
        "Name, email, password, and companyName are required"
      );
    }

    const user = await registerUser({
      name,
      email: String(email).trim().toLowerCase(),
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
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

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
    sameSite: (config.nodeEnv === "production" ? "none" : "lax") as
      | "none"
      | "lax",
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
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

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
    sameSite: (config.nodeEnv === "production" ? "none" : "lax") as
      | "none"
      | "lax",
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
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const { accessToken, refreshToken } =
    await refreshAccessToken(incomingRefreshToken);

  const options = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: (config.nodeEnv === "production" ? "none" : "lax") as
      | "none"
      | "lax",
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
    sameSite: (config.nodeEnv === "production" ? "none" : "lax") as
      | "none"
      | "lax",
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

export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }

    const { name, phone_number, country } = req.body;
    const updateData: {
      name?: string;
      phone_number?: string;
      country?: string;
      profile_image?: string;
    } = {};

    // Only update fields that are provided
    if (name !== undefined) updateData.name = name;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (country !== undefined) updateData.country = country;

    // Handle profile image upload
    if (req.file) {
      const profileImageUrl = await uploadImageToSupabase(
        req.file.buffer,
        req.file.mimetype,
        "profile_images",
        800
      );
      updateData.profile_image = profileImageUrl;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  }
);

export const verifyUserOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }
    await verifyOtp(email, otp);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Email verified successfully."));
  }
);

export const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
    await sendPasswordResetOtp(email);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset OTP sent."));
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      throw new ApiError(400, "Email, OTP, and newPassword are required");
    }
    await resetPasswordWithOtp(email, otp, newPassword);
    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Password has been reset successfully.")
      );
  }
);

export const verifyPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }
    await verifyPasswordResetOtp(email, otp);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset OTP verified."));
  }
);

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  await sendVerificationOtp(String(email).trim().toLowerCase());

  res
    .status(200)
    .json(new ApiResponse(200, null, "Verification OTP sent successfully."));
});
