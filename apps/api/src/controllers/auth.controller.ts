import { prisma, Role } from "@packtok/db";
import { Request, Response } from "express";
import config from "../config";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
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

  // Enforce role: only NORMAL_USER can use normal login
  if (user.role !== Role.NORMAL_USER) {
    throw new ApiError(
      403,
      "Invalid role for these credentials. Please use vendor sign-in."
    );
  }

  const options = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict" as const,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { accessToken, user }, "Login successful"));
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
    sameSite: "strict" as const,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { accessToken, user }, "Vendor login successful")
    );
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const accessToken = await refreshAccessToken(incomingRefreshToken);
  res
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // For Supabase-managed sessions, removing the refresh token on the client is sufficient

  const options = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict" as const,
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
