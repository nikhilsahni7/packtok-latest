"use client";

import { useAuthStore } from "@/store/auth-store";
import { Button } from "@packtok/ui/components/button";
import { cn } from "@packtok/ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface LogoutButtonProps {
  className?: string;
  onLoggedOut?: () => void;
}

export default function LogoutButton({
  className,
  onLoggedOut,
}: Readonly<LogoutButtonProps>) {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleClick = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      // Clear all React Query cache so stale user data doesn't persist
      queryClient.clear();
      toast.success("Logged out");
      onLoggedOut?.();
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={isLoggingOut}
      className={cn(
        "text-sm font-medium min-w-fit whitespace-nowrap",
        className
      )}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}
