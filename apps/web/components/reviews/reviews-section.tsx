"use client";

import { Edit2, Trash2, VerifiedIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { StarRatingDisplay } from "./star-rating-display";
import { StarRatingInput } from "./star-rating-input";

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profile_image?: string | null;
  };
}

interface ReviewsSectionProps {
  productId: string;
  currentUserId?: string | null;
  accessToken?: string | null;
}

export function ReviewsSection

({
  productId,
  currentUserId,
  accessToken,
}: ReviewsSectionProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [canReview, setCanReview] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${productId}/reviews`
      );
      const data = await res.json();
      if (data.statusCode === 200 && data.data) {
        setReviews(data.data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${productId}/reviews/stats`
      );
      const data = await res.json();
      if (data.statusCode === 200 && data.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Check if user can review
  const checkCanReview = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${productId}/reviews/can-review`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      if (data.statusCode === 200 && data.data) {
        setCanReview(data.data.canReview);
        if (data.data.existingReview) {
          setExistingReview(data.data.existingReview);
          setRating(data.data.existingReview.rating);
          setComment(data.data.existingReview.comment || "");
        }
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error);
    }
  };

  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      router.push("/auth/signin");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );
      const data = await res.json();

      if (data.statusCode === 201 || data.statusCode === 200) {
        toast.success("Review submitted successfully!");
        setRating(5);
        setComment("");
        setCanReview(false);
        fetchReviews();
        fetchStats();
        checkCanReview();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit review
  const handleEdit = async () => {
    if (!existingReview || !accessToken) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/${existingReview.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );
      const data = await res.json();

      if (data.statusCode === 200) {
        toast.success("Review updated successfully!");
        setIsEditing(false);
        fetchReviews();
        fetchStats();
        checkCanReview();
      } else {
        toast.error(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete review
  const handleDelete = async () => {
    if (!existingReview || !accessToken) return;
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/${existingReview.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();

      if (data.statusCode === 200) {
        toast.success("Review deleted successfully!");
        setExistingReview(null);
        setRating(5);
        setComment("");
        setCanReview(true);
        setIsEditing(false);
        fetchReviews();
        fetchStats();
        checkCanReview();
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Initial load
  useEffect(() => {
    fetchReviews();
    fetchStats();
    if (accessToken) {
      checkCanReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, accessToken]);



  return (
    <div className="mt-12 border-t pt-8">
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
          {stats.totalReviews > 0 ? (
            <div className="flex items-center gap-3">
              <StarRatingDisplay rating={stats.averageRating} size="md" showNumber />
              <span className="text-sm text-gray-600">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet</p>
          )}
        </div>
      </div>


      {/* Review form */}
      {accessToken && (canReview || existingReview) && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
          {existingReview && !isEditing ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Your Review</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <StarRatingDisplay rating={existingReview.rating} size="md" />
              </div>
              {existingReview.comment && (
                <p className="text-gray-700">{existingReview.comment}</p>
              )}
            </div>
          ) : (
            <form onSubmit={isEditing ? handleEdit : handleSubmit}>
              <h3 className="font-semibold mb-4">
                {isEditing ? "Edit Your Review" : "Write a Review"}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Rating
                </label>
                <StarRatingInput
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isEditing
                    ? "Update Review"
                    : "Submit Review"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setRating(existingReview!.rating);
                      setComment(existingReview!.comment || "");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* Not eligible message */}
      {accessToken && !canReview && !existingReview && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          You need to purchase this product before you can leave a review.
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="pb-6 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {review.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{review.user.name}</span>
                    {review.isVerified && (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        <VerifiedIcon className="w-3 h-3" fill="currentColor" />
                        Verified Purchase
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <StarRatingDisplay rating={review.rating} size="sm" />
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !canReview &&
        !existingReview && (
          <p className="text-gray-600 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        )
      )}
    </div>
  );
}
