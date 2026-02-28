"use client";

import { ReviewsSection } from "@/components/reviews/reviews-section";
import { useAuctionRealtime } from "@/hooks/useAuctionRealtime";
import {
  useAuction,
  useConfirmEnrollmentPayment,
  useEnrollInAuction,
  useMyAuctionEnrollments,
  usePlaceBid,
} from "@/hooks/useAuctions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { loadRazorpayCheckout } from "@/lib/razorpay";
import { useAuthStore } from "@/store/auth-store";
import {
  Auction,
  AuctionLeaderboardSnapshot,
  AuctionStatus,
} from "@/types/auction";
import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packtok/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@packtok/ui/components/dialog";
import { Input } from "@packtok/ui/components/input";
import { ChevronDown, ChevronUp, HelpCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

// Countdown hook for inline timer
function useCountdown(targetDate: string | null | undefined) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const difference = Math.max(target - now, 0);

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

const statusVariant: Record<AuctionStatus, string> = {
  DRAFT: "bg-gray-200 text-gray-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  LIVE: "bg-green-100 text-green-700",
  CLOSED: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const formatCurrency = (
  amount: string | undefined | null,
  currency: string
) => {
  if (!amount) {
    return `${currency} 0`;
  }
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) {
    return `${currency} ${amount}`;
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numeric);
};

const getCurrentAmount = (
  auction: Auction | undefined | null,
  snapshot: AuctionLeaderboardSnapshot | null
) => {
  if (snapshot?.currentAmount) {
    return snapshot.currentAmount;
  }
  return (
    auction?.leaderboard?.snapshot?.currentAmount ??
    auction?.startingAmount ??
    "0"
  );
};

export default function AuctionDetailPage({ auctionId }: { auctionId: string }) {
  const router = useRouter();

  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: user } = useCurrentUser();
  const isAuthenticated = Boolean(accessToken && user);

  const { data: auction, isLoading, isError, refetch } = useAuction(auctionId);
  const { data: enrollments = [], isLoading: loadingEnrollments } =
    useMyAuctionEnrollments({
      enabled: Boolean(auctionId) && isAuthenticated,
    });
  const enrollMutation = useEnrollInAuction();
  const confirmEnrollmentMutation = useConfirmEnrollmentPayment();
  const placeBidMutation = usePlaceBid();
  const [bidAmount, setBidAmount] = useState("");
  const [snapshot, setSnapshot] = useState<AuctionLeaderboardSnapshot | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingBidAmount, setPendingBidAmount] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);

  // Use countdown hook for auction end time
  const countdown = useCountdown(
    auction?.status === "LIVE" ? auction.endAt : null
  );

  useEffect(() => {
    if (auction?.leaderboard?.snapshot) {
      setSnapshot(auction.leaderboard.snapshot);
    }
  }, [auction?.leaderboard?.snapshot]);

  useEffect(() => {
    if (!auction?.productId) return;

    const fetchReviewStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${auction.productId}/reviews/stats`
        );
        const data = await res.json();
        if (data.statusCode === 200 && data.data) {
          setReviewStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching review stats:", error);
      }
    };

    fetchReviewStats();
  }, [auction?.productId]);

  useAuctionRealtime(auction?.id ?? null, {
    onLeaderboard: (event) => {
      setSnapshot(event.leaderboard ?? null);
    },
    onFinalized: () => {
      toast.success("Auction finalized");
      refetch();
    },
    onBidPlaced: () => {
      refetch();
    },
  });

  const myEnrollment = useMemo(
    () => enrollments.find((entry) => entry.auctionId === auctionId) ?? null,
    [enrollments, auctionId]
  );

  const hasActiveEnrollment = myEnrollment?.status === "ACTIVE";
  const enrollmentPending =
    enrollMutation.isPending || confirmEnrollmentMutation.isPending;
  const canBid = auction?.status === "LIVE" && hasActiveEnrollment;
  const currentAmount = getCurrentAmount(auction, snapshot);

  // Calculate minimum bid amount
  const minBidAmount = useMemo(() => {
    if (!auction) return null;
    const current = parseFloat(currentAmount);
    if (auction.mode === "FORWARD") {
      const increment = parseFloat(
        auction.minBidIncrement?.toString() ?? "100"
      );
      return current + increment;
    } else {
      const decrement = parseFloat(
        auction.minBidDecrement?.toString() ?? "100"
      );
      return current - decrement;
    }
  }, [auction, currentAmount]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to enroll in this auction");
      router.push(`/auth/signin?redirect=/bidding/${auctionId}`);
      return;
    }

    if (!auction || !auctionId) {
      toast.error("Auction details unavailable");
      return;
    }

    try {
      await loadRazorpayCheckout();
    } catch (error) {
      toast.error("Failed to load Razorpay checkout");
      return;
    }

    try {
      const initiation = await enrollMutation.mutateAsync({ auctionId });
      const { paymentIntent, razorpayKey, razorpayOrder } = initiation;

      const handlePaymentSuccess = async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          await confirmEnrollmentMutation.mutateAsync({
            auctionId,
            paymentIntentId: paymentIntent.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          toast.success("Enrollment confirmed");
          setShowSuccessDialog(true);
          refetch();
        } catch (error) {
          toast.error("Failed to confirm payment");
        }
      };

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not available");
        return;
      }

      const instance = new window.Razorpay({
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: auction.product?.title ?? "Packtok Auction",
        description: `Earnest money for ${auction.product?.title ?? auction.id}`,
        order_id: razorpayOrder.id,
        handler: handlePaymentSuccess,
        modal: {
          ondismiss: () => {
            toast("Payment cancelled");
          },
        },
      });

      instance.open();
    } catch (error) {
      toast.error("Failed to initiate enrollment");
    }
  };

  const handleSubmitBid = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to place a bid");
      router.push(`/auth/signin?redirect=/bidding/${auctionId}`);
      return;
    }

    if (!auctionId || !auction) {
      toast.error("Auction details unavailable");
      return;
    }

    if (!canBid) {
      if (auction.status !== "LIVE") {
        toast.error("Auction is not live yet");
      } else if (!hasActiveEnrollment) {
        toast.error("You must enroll before bidding");
      }
      return;
    }

    const numericAmount = Number(bidAmount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Enter a valid bid amount");
      return;
    }

    // Validate minimum bid amount
    if (minBidAmount !== null) {
      if (auction.mode === "FORWARD") {
        if (numericAmount < minBidAmount) {
          toast.error(
            `Bid must be at least ${formatCurrency(
              minBidAmount.toString(),
              auction.currency
            )}`
          );
          return;
        }
      } else {
        if (minBidAmount <= 0) {
          if (numericAmount >= parseFloat(currentAmount)) {
            toast.error("Bid must be strictly lower than the current amount");
            return;
          }
        } else {
          if (numericAmount > minBidAmount) {
            toast.error(
              `Bid must be ${formatCurrency(
                minBidAmount.toString(),
                auction.currency
              )} or lower`
            );
            return;
          }
        }

        if (numericAmount <= 0) {
          toast.error("Bid must be greater than zero");
          return;
        }
      }
    }

    // Show confirmation dialog
    setPendingBidAmount(bidAmount);
    setShowConfirmDialog(true);
  };

  const confirmBid = async () => {
    const numericAmount = Number(pendingBidAmount);

    try {
      await placeBidMutation.mutateAsync({ auctionId, amount: numericAmount });
      toast.success("Bid submitted successfully!");
      setBidAmount("");
      setPendingBidAmount("");
      setShowConfirmDialog(false);
      refetch();
    } catch (error) {
      toast.error("Failed to submit bid");
    }
  };

  if (isLoading || loadingEnrollments) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-6">
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Product Images Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
              {/* Auction Info Skeleton */}
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-600 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 rounded bg-gray-600" />
                      <div className="h-3 w-24 rounded bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-gray-700" />
                      <div className="h-5 w-24 rounded bg-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-gray-700" />
                      <div className="h-5 w-24 rounded bg-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border p-6 animate-pulse">
                  <div className="h-5 w-32 rounded bg-gray-200 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200" />
                          <div className="space-y-1">
                            <div className="h-4 w-24 rounded bg-gray-200" />
                            <div className="h-3 w-16 rounded bg-gray-200" />
                          </div>
                        </div>
                        <div className="h-4 w-16 rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !auction) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Auction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Unable to load this auction.</p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/bidding">Back to auctions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const product = auction.product;

  const bidders =
    snapshot?.bidders ?? auction.leaderboard?.snapshot?.bidders ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Product Images Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <Link
            href="/bidding"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to auctions
          </Link>

          <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Product Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product?.images && product.images.length > 0 ? (
                product.images.slice(0, 4).map((image: string, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg" />
                  <div className="aspect-square bg-gray-100 rounded-lg" />
                  <div className="aspect-square bg-gray-100 rounded-lg" />
                </>
              )}
            </div>

            {/* Auction Info Panel */}
            <div className="w-full lg:block">
              <div className="bg-black text-white rounded-lg p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {user?.name?.charAt(0) ?? "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-semibold text-lg">
                        {product?.title ?? "Auction"}
                      </h2>
                      {auction.mode === "REVERSE" && (
                        <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-[10px] px-1.5 py-0 leading-tight">
                          REVERSE BID - BID LOWER
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {user?.name ?? "Owner"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Starting price</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(auction.startingAmount, auction.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Bid Price</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(currentAmount, auction.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {bidders.slice(0, 3).map((bidder, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-black flex items-center justify-center"
                          title={bidder.name || "Anonymous"}
                        >
                          <span className="text-xs font-bold text-white">
                            {bidder.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-gray-300">are Live</span>
                  </div>
                  {auction.status === "LIVE" && (
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-gray-300">
                        {countdown.hours.toString().padStart(2, "0")}:
                        {countdown.minutes.toString().padStart(2, "0")}:
                        {countdown.seconds.toString().padStart(2, "0")}{" "}
                        remaining
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enrollment Notice */}
              {!hasActiveEnrollment && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-800 mb-3">
                    To ensure serious participation, users must pay an initial,
                    refundable deposit to join a bid.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Examples:</strong> ₹10,000 for a bid on boxes or ₹1
                    lakh for a bid on machinery.
                  </p>
                  <div className="text-xs text-gray-600 space-y-1 mb-3">
                    <p>
                      Only users who paid the earnest money can actively
                      participate in the online bidding room. Their usernames
                      will be highlighted to display their active status.
                    </p>
                    <p>
                      Users who paid can see the bidding room and the ongoing
                      bids but cannot place bids themselves.
                    </p>
                    <p>
                      All bids will be initiated and confirmed by the Admin.
                    </p>
                    <p>
                      Bids close at a defined time (e.g., 30 days), after which
                      they will automatically close.
                    </p>
                    <p>
                      Winners will be notified automatically via email upon the
                      bid&apos;s conclusion.
                    </p>
                  </div>
                  <Button
                    onClick={handleEnroll}
                    disabled={enrollmentPending || hasActiveEnrollment}
                    className="w-full mt-4 bg-black hover:bg-gray-800"
                  >
                    {hasActiveEnrollment
                      ? "Already enrolled"
                      : enrollmentPending
                        ? "Processing..."
                        : "Earnest Money"}
                  </Button>
                  {!isAuthenticated && (
                    <Button
                      onClick={() =>
                        router.push(
                          `/auth/signin?redirect=/bidding/${auctionId}`
                        )
                      }
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Deposit
                    </Button>
                  )}
                </div>
              )}

              {/* Live Auction Section */}
              {auction.status === "LIVE" && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      Live Auction
                    </h3>
                    <span className="text-sm text-gray-600">
                      {bidders.length} Bids made
                    </span>
                  </div>

                  {/* Top 5 Bidders */}
                  <div className="space-y-3 mb-6">
                    {bidders.slice(0, 5).map((bid) => (
                      <div
                        key={bid.bidId}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {bid.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {bid.name ?? "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {bid.email || `Bid #${bid.sequence}`}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">{bid.amount}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Bid Buttons */}
                  {hasActiveEnrollment && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
                        {(auction.mode === "REVERSE"
                          ? [
                              minBidAmount || 0,
                              (minBidAmount || 0) - (Number(auction.minBidDecrement) || 100),
                              (minBidAmount || 0) - (Number(auction.minBidDecrement) || 100) * 2,
                              (minBidAmount || 0) - (Number(auction.minBidDecrement) || 100) * 5,
                            ]
                          : [
                              minBidAmount || 0,
                              (minBidAmount || 0) + (Number(auction.minBidIncrement) || 100),
                              (minBidAmount || 0) + (Number(auction.minBidIncrement) || 100) * 2,
                              (minBidAmount || 0) + (Number(auction.minBidIncrement) || 100) * 5,
                            ]
                        ).map(
                          (amount, idx) =>
                            amount > 0 && (
                              <button
                                key={idx}
                                onClick={() => setBidAmount(amount.toString())}
                                className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 text-center flex items-center justify-center flex-col shadow-sm transition-all"
                              >
                                <span className="font-bold">
                                  {formatCurrency(amount.toString(), auction.currency)}
                                </span>
                                {idx === 0 ? (
                                  <span className="text-[10px] text-gray-500 mt-1 uppercase">Min Bid</span>
                                ) : null}
                              </button>
                            )
                        )}
                      </div>

                      {/* Custom Bid Input */}
                      <form onSubmit={handleSubmitBid} className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="use custom bid"
                            className="flex-1"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={!canBid || placeBidMutation.isPending}
                          className="w-full bg-orange-500 hover:bg-orange-600"
                        >
                          {placeBidMutation.isPending
                            ? "Submitting..."
                            : `Place Bid for ${auction.currency}${bidAmount || "0"}`}
                        </Button>
                      </form>
                    </>
                  )}

                  {!hasActiveEnrollment && (
                    <p className="text-sm text-center text-gray-500 py-4">
                      Enroll to start bidding
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Reviews Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        reviewStats && i < Math.round(reviewStats.averageRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {reviewStats ? `${reviewStats.totalReviews} Reviews` : "No reviews yet"}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-2">
                {product?.title ?? "Auction"}
              </h1>

              {/* Manufacturer • Model • Year */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>{product?.manufacturer || "Manufacturer"}</span>
                <span>•</span>
                <span>{product?.model || "Model"}</span>
                <span>•</span>
                <span>{product?.year || "Year"}</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {product?.description ??
                  "Produce premium-quality ice cream at scale with this high-efficiency machine, perfect for commercial kitchens, factories, or dairy processing plants. Engineered for consistency, durability, and speed—ideal for meeting high production demands."}
              </p>

              {/* Technical Specifications & Equipment Details */}
              <div className="mt-8 grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                    Technical Specs
                  </h3>
                  <div className="space-y-3">
                    {product?.specifications && typeof product.specifications === 'object' ? (
                      Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm items-center">
                          <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-semibold text-gray-900">{String(value)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">No specifications provided</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    Equipment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500">Manufacturer:</span>
                      <span className="font-semibold text-gray-900">{product?.manufacturer || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500">Model:</span>
                      <span className="font-semibold text-gray-900">{product?.model || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500">Year:</span>
                      <span className="font-semibold text-gray-900">{product?.year || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500">Condition:</span>
                      <Badge variant="outline" className="bg-white font-bold text-xs">
                        {product?.condition || '-'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* SKU & Category Integration */}
              <div className="mt-8 flex flex-wrap gap-12 border-t border-gray-100 pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Product SKU</span>
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {product?.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Category</span>
                  <span className="text-sm font-bold text-orange-600">
                    {product?.category?.name || product?.productType?.replaceAll("_", " ") || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-t pt-8">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
              </div>

              {product?.faqs && Array.isArray(product.faqs) && product.faqs.length > 0 ? (
                <div className="space-y-3">
                  {(product.faqs as any[]).map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === index ? null : index)
                        }
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">
                          {faq.question}
                        </span>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4 text-gray-600 leading-relaxed text-sm">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">
                    No questions asked yet. Be the first!
                  </p>
                </div>
              )}
            </div>

            {/* Reviews Detail Section */}
            <div className="bg-white rounded-lg p-6">
              <ReviewsSection
                productId={product?.id || ""}
                currentUserId={user?.id || ""}
                accessToken={accessToken || ""}
              />
            </div>
          </div>
        </div>
      </div>



      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Confirm Bid
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              You have placed a bid for{" "}
              {formatCurrency(pendingBidAmount, auction?.currency || "USD")}.
              Should we place this bid on your Bid?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={confirmBid}
              disabled={placeBidMutation.isPending}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {placeBidMutation.isPending
                ? "Processing..."
                : "Yes, Place My Bid"}
            </Button>
            <Button
              onClick={() => setShowConfirmDialog(false)}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog - Earnest Money Paid */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Done!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              You Deposit has been successfully paid
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
