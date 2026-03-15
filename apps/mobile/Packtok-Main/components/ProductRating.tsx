import { useReviewStats } from "@/hooks/useReviews";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface ProductRatingProps {
  productId: string;
  size?: number;
}

export default function ProductRating({
  productId,
  size = 14,
}: ProductRatingProps) {
  const { data: stats } = useReviewStats(productId);

  if (!stats || stats.totalReviews === 0) {
    return null;
  }

  return (
    <View className="flex-row items-center">
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name="star"
            size={size}
            color={star <= Math.round(stats.averageRating) ? "#000" : "#D1D5DB"}
          />
        ))}
      </View>
      <Text className="text-gray-500 text-xs ml-1">
        {stats.averageRating.toFixed(1)} ({stats.totalReviews})
      </Text>
    </View>
  );
}
