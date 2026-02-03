"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export function StarRatingInput({
  rating,
  onRatingChange,
  size = "md",
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`${starSize} transition-colors ${
                isActive
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
