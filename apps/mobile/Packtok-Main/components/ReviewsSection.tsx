import {
  Review,
  useCanReview,
  useDeleteReview,
  useEditReview,
  useReviews,
  useReviewStats,
  useSubmitReview,
} from "@/hooks/useReviews";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ReviewsSectionProps {
  productId: string;
}

// Star rating input
function StarInput({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange(star)}
          className="mr-1"
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="star"
            size={32}
            color={star <= rating ? "#F59E0B" : "#D1D5DB"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Single review item - matching Figma design
function ReviewItem({ review }: { review: Review }) {
  const avatarUrl = review.user.profile_image;
  const initial = review.user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <View className="flex-row mb-6">
      {/* Avatar */}
      <View className="mr-3">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-gray-600 font-semibold text-base">
              {initial}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-base font-semibold text-gray-900">
            {review.user.name}
          </Text>
          {review.isVerified && (
            <View className="flex-row items-center bg-green-50 px-2 py-0.5 rounded ml-2">
              <MaterialIcons name="verified" size={12} color="#16A34A" />
              <Text className="text-xs text-green-600 ml-0.5">Verified</Text>
            </View>
          )}
        </View>

        {/* Stars */}
        <View className="flex-row mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <MaterialIcons
              key={star}
              name="star"
              size={16}
              color={star <= review.rating ? "#F59E0B" : "#D1D5DB"}
            />
          ))}
        </View>

        {/* Comment */}
        {review.comment && (
          <Text className="text-sm text-gray-600 leading-5">
            {review.comment}
          </Text>
        )}

        {/* Date */}
        <Text className="text-xs text-gray-400 mt-1">
          {new Date(review.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
    </View>
  );
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { data: stats } = useReviewStats(productId);
  const { data: reviews = [], isLoading } = useReviews(productId);
  const { data: canReviewData } = useCanReview(productId);
  const submitReview = useSubmitReview(productId);
  const editReview = useEditReview(productId);
  const deleteReview = useDeleteReview(productId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const canReview = canReviewData?.canReview || false;
  const existingReview = canReviewData?.existingReview || null;

  const handleSubmit = () => {
    if (isEditing && existingReview) {
      editReview.mutate(
        { reviewId: existingReview.id, rating, comment },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    } else {
      submitReview.mutate({ rating, comment });
    }
  };

  const handleDelete = () => {
    if (!existingReview) return;
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete your review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteReview.mutate(existingReview.id, {
              onSuccess: () => {
                setIsEditing(false);
                setRating(5);
                setComment("");
              },
            });
          },
        },
      ]
    );
  };

  const startEditing = () => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
      setIsEditing(true);
    }
  };

  return (
    <View className="bg-white px-4 py-5 mb-2">
      {/* Header */}
      <Text className="text-xl font-bold text-gray-900 mb-1">Reviews</Text>

      {/* Stats summary */}
      {stats && stats.totalReviews > 0 ? (
        <View className="flex-row items-center mb-4">
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons
                key={star}
                name="star"
                size={18}
                color={
                  star <= Math.round(stats.averageRating)
                    ? "#F59E0B"
                    : "#D1D5DB"
                }
              />
            ))}
          </View>
          <Text className="text-sm text-gray-600 ml-2">
            {stats.averageRating.toFixed(1)} ({stats.totalReviews} review
            {stats.totalReviews !== 1 ? "s" : ""})
          </Text>
        </View>
      ) : (
        <Text className="text-gray-500 text-sm mb-4">No reviews yet</Text>
      )}

      {/* Review form — write or edit */}
      {(canReview || existingReview) && (
        <View className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
          {existingReview && !isEditing ? (
            /* Show existing review with edit/delete */
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-semibold text-gray-900">
                  Your Review
                </Text>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={startEditing}
                    className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-lg mr-2"
                  >
                    <Feather name="edit-2" size={14} color="#2563EB" />
                    <Text className="text-blue-600 text-xs ml-1 font-medium">
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-lg"
                  >
                    <Feather name="trash-2" size={14} color="#DC2626" />
                    <Text className="text-red-600 text-xs ml-1 font-medium">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialIcons
                    key={star}
                    name="star"
                    size={20}
                    color={
                      star <= existingReview.rating ? "#F59E0B" : "#D1D5DB"
                    }
                  />
                ))}
              </View>
              {existingReview.comment && (
                <Text className="text-sm text-gray-700 mt-1">
                  {existingReview.comment}
                </Text>
              )}
            </View>
          ) : (
            /* Write / edit form */
            <View>
              <Text className="font-semibold text-gray-900 mb-3">
                {isEditing ? "Edit Your Review" : "Write a Review"}
              </Text>

              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">Rating</Text>
                <StarInput rating={rating} onChange={setRating} />
              </View>

              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">
                  Comment (Optional)
                </Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Share your experience..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-base text-gray-900"
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>

              <View className="flex-row">
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={submitReview.isPending || editReview.isPending}
                  className="bg-gray-900 px-5 py-3 rounded-lg mr-2"
                  activeOpacity={0.8}
                >
                  {submitReview.isPending || editReview.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-sm">
                      {isEditing ? "Update" : "Submit"}
                    </Text>
                  )}
                </TouchableOpacity>
                {isEditing && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditing(false);
                      setRating(existingReview?.rating || 5);
                      setComment(existingReview?.comment || "");
                    }}
                    className="border border-gray-300 px-5 py-3 rounded-lg"
                  >
                    <Text className="text-gray-700 font-semibold text-sm">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Not eligible message */}
      {!canReview && !existingReview && (
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <Text className="text-blue-800 text-sm">
            You need to purchase this product before you can leave a review.
          </Text>
        </View>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <ActivityIndicator size="small" color="#FF6B2C" />
      ) : reviews.length > 0 ? (
        <View>
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </View>
      ) : (
        !canReview &&
        !existingReview && (
          <Text className="text-gray-500 text-center py-4">
            No reviews yet. Be the first to review this product!
          </Text>
        )
      )}
    </View>
  );
}
