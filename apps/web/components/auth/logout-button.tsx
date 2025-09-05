"use client";

import { useAuthStore } from "@/store/auth-store";
import { Button } from "@packtok/ui/components/button";
import { cn } from "@packtok/ui/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleClick = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={cn("text-sm font-medium", className)}
    >
      Logout
    </Button>
  );
}
