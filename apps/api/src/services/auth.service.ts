import { prisma, Prisma, User } from "@packtok/db";
import crypto from "crypto";
import { Resend } from "resend";
import config from "../config";
import { ApiError } from "../utils/apiError";
import supabase from "../utils/supabaseClient";

const resend = new Resend(config.resend.apiKey);

const hashOtp = (otp: string) =>
  crypto
    .createHash("sha256")
    .update(otp + config.supabase.jwtSecret)
    .digest("hex");

/**
 * Registers a user in Supabase auth and in the local Prisma `User` table for metadata.
 */
export const registerUser = async (userData: {
  name: string;
  email: string;
  phone_number?: string;
  country?: string;
  password: string;
}): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // If phone number is supplied ensure it's unique in our DB first
  if (userData.phone_number) {
    const existsPhone = await prisma.user.findFirst({
      where: { phone_number: userData.phone_number },
      select: { id: true },
    });
    if (existsPhone) {
      throw new ApiError(409, "Phone number is already in use");
    }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    phone: userData.phone_number,
    user_metadata: { name: userData.name, country: userData.country },
    email_confirm: false,
  });

  if (error || !data.user) {
    if (error?.message?.toLowerCase().includes("user already registered")) {
      throw new ApiError(409, "User with this email already exists");
    }
    throw new ApiError(500, `Supabase error: ${error?.message}`);
  }

  let newUser: User;
  try {
    newUser = await prisma.user.create({
      data: {
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone_number,
        country: userData.country,
      },
    } as any);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new ApiError(409, "Email or phone number already in use");
    }
    throw err;
  }

  await sendVerificationOtp(userData.email);

  return newUser;
};

/**
 * Logs a user in through Supabase.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: User;
}> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("email not confirmed") || msg.includes("confirm")) {
      await sendVerificationOtp(email);
      throw new ApiError(403, "Account not verified. A new OTP has been sent.");
    }
    throw new ApiError(401, "Invalid email or password");
  }

  if (!data.session) {
    throw new ApiError(500, "No session returned by Supabase");
  }

  let user = await prisma.user.findUnique({
    where: { id: data.session.user.id },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: data.session.user.id,
        name: data.session.user.user_metadata?.name || "",
        email: data.session.user.email!,
        phone_number: data.session.user.phone,
        country: (data.session.user.user_metadata as any)?.country,
      },
    } as any);
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token!,
    user,
  };
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    throw new ApiError(401, "Unable to refresh session");
  }

  const { access_token: accessToken, refresh_token: nextRefreshToken } =
    data.session;

  if (!accessToken) {
    throw new ApiError(401, "Unable to refresh session");
  }

  return {
    accessToken,
    refreshToken: nextRefreshToken || refreshToken,
  };
};

export const logoutUser = async (userId: string) => {
  const { error } = await (supabase.auth.admin as any).signOutUser(userId);
  if (error) {
    throw new ApiError(400, `Unable to logout: ${error.message}`);
  }
};

// ------------------ OTP FLOW ------------------
export const sendVerificationOtp = async (email: string) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  await (prisma as any).otp.upsert({
    where: { userId: user.id },
    update: { hashedOtp, expiresAt },
    create: { userId: user.id, hashedOtp, expiresAt },
  });

  await resend.emails.send({
    from: config.resend.fromEmail,
    to: email,
    subject: "Your Packtok verification code",
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });
};

export const verifyOtp = async (email: string, otp: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  const otpRecord = await (prisma as any).otp.findUnique({
    where: { userId: user.id },
  });
  if (!otpRecord) throw new ApiError(400, "Invalid OTP request");

  const isMatch = otpRecord.hashedOtp === hashOtp(otp);
  if (!isMatch || otpRecord.expiresAt < new Date())
    throw new ApiError(400, "Invalid or expired OTP");

  const { error } = await (supabase.auth.admin as any).updateUserById(user.id, {
    email_confirm: true,
  });
  if (error)
    throw new ApiError(500, `Supabase update failed: ${error.message}`);

  // Clean up
  await (prisma as any).otp.delete({ where: { id: otpRecord.id } });
};

// ------------------ PASSWORD RESET FLOW ------------------
export const sendPasswordResetOtp = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  // Reuse the single OTP slot per user
  await (prisma as any).otp.upsert({
    where: { userId: user.id },
    update: { hashedOtp, expiresAt },
    create: { userId: user.id, hashedOtp, expiresAt },
  });

  await resend.emails.send({
    from: config.resend.fromEmail,
    to: email,
    subject: "Your Packtok password reset code",
    html: `<p>Your password reset OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });
};

export const resetPasswordWithOtp = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");

  const otpRecord = await (prisma as any).otp.findUnique({
    where: { userId: user.id },
  });
  if (!otpRecord) throw new ApiError(400, "Invalid OTP request");

  const isMatch = otpRecord.hashedOtp === hashOtp(otp);
  if (!isMatch || otpRecord.expiresAt < new Date())
    throw new ApiError(400, "Invalid or expired OTP");

  // Update password in Supabase auth
  const { error } = await (supabase.auth.admin as any).updateUserById(user.id, {
    password: newPassword,
  });
  if (error)
    throw new ApiError(500, `Supabase update failed: ${error.message}`);

  // Clean up OTP
  await (prisma as any).otp.delete({ where: { id: otpRecord.id } });
};
