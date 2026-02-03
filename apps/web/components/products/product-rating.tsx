"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductRatingProps {
  productId: string;
}

export function ProductRating({ productId }: ProductRatingProps) {
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${productId}/reviews/stats`
        );
        const data = await res.json();
        if (data.statusCode === 200 && data.data && data.data.totalReviews > 0) {
          setStats(data.data);
        }
      } catch (error) {
        // Silently fail - no ratings to show
      }
    };
    fetchStats();
  }, [productId]);

  if (!stats || stats.totalReviews === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.round(stats.averageRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-gray-600 font-medium">
        {stats.averageRating.toFixed(1)} ({stats.totalReviews})
      </span>
    </div>
  );
}
