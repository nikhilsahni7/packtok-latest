import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "../types/auth";

// Fetch current user on the server using the refreshToken cookie directly
export async function getCurrentUserServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const refresh = cookieStore.get("refreshToken");
  if (!refresh) return null;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`,
      {
        headers: {
          Cookie: `refreshToken=${refresh.value}`,
        },
      },
    );
    return res.data.data as User;
  } catch {
    return null;
  }
}

// Redirects to /auth/signin if not authenticated
export async function requireUser(): Promise<User> {
  const user = await getCurrentUserServer();
  if (!user) redirect("/auth/signin");
  return user;
}

// Redirects to /auth/signin if not authenticated OR not admin
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUserServer();
  if (!user) redirect("/auth/signin");

  // Check if user is admin or super admin
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/auth/signin");
  }

  return user;
}
