"use client";

import { useBookmarkToggle } from "@/hooks/useBookmarks";
import { Heart } from "lucide-react";

interface BookmarkButtonProps {
  readonly productId: string;
  readonly size?: "sm" | "md";
  readonly className?: string;
}

export function BookmarkButton({
  productId,
  size = "sm",
  className = "",
}: BookmarkButtonProps) {
  const { isBookmarked, isLoading, toggle } = useBookmarkToggle(productId);

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const padding = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggle();
      }}
      disabled={isLoading}
      className={`${padding} rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
        isBookmarked
          ? "text-red-500"
          : "text-gray-400 hover:text-red-500"
      } ${className}`}
      title={isBookmarked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`${iconSize} transition-all ${isBookmarked ? "fill-red-500" : ""}`}
      />
    </button>
  );
}
