import { Star } from "lucide-react";

interface StarRatingDisplayProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export function StarRatingDisplay({
  rating,
  size = "sm",
  showNumber = false,
}: StarRatingDisplayProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      {showNumber && (
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
