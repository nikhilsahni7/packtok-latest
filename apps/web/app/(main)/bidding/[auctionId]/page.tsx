"use client";

import { AuctionCountdown } from "@/components/bidding";
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
import { Input } from "@packtok/ui/components/input";
import { Loading } from "@packtok/ui/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packtok/ui/components/table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

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

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
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

export default function AuctionDetailPage() {
  const params = useParams<{ auctionId: string }>();
  const auctionId = params?.auctionId ?? "";
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

  useEffect(() => {
    if (auction?.leaderboard?.snapshot) {
      setSnapshot(auction.leaderboard.snapshot);
    }
  }, [auction?.leaderboard?.snapshot]);

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
        if (numericAmount <= minBidAmount) {
          toast.error(
            `Bid must be greater than ${formatCurrency(
              minBidAmount.toString(),
              auction.currency
            )}`
          );
          return;
        }
      } else {
        if (numericAmount >= minBidAmount) {
          toast.error(
            `Bid must be less than ${formatCurrency(
              minBidAmount.toString(),
              auction.currency
            )}`
          );
          return;
        }
        if (numericAmount <= 0) {
          toast.error("Bid must be greater than zero");
          return;
        }
      }
    }

    try {
      await placeBidMutation.mutateAsync({ auctionId, amount: numericAmount });
      toast.success("Bid submitted");
      setBidAmount("");
      refetch();
    } catch (error) {
      toast.error("Failed to submit bid");
    }
  };

  if (isLoading || loadingEnrollments) {
    return (
      <main className="min-h-screen bg-white">
        <div className="relative h-64">
          <Loading variant="jimu" />
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
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/bidding"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              &larr; Back to auctions
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product?.title ?? "Auction"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <Badge className={statusVariant[auction.status]}>
                {auction.status}
              </Badge>
              <span>Mode: {auction.mode}</span>
              <span>Starts {formatDateTime(auction.startAt)}</span>
              <span>Ends {formatDateTime(auction.endAt)}</span>
            </div>
          </div>
          <div className="w-full max-w-md">
            <AuctionCountdown nextAuction={auction} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Product overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-700">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <span className="text-gray-500">Category</span>
                  <p className="font-medium">
                    {product?.productType?.replaceAll("_", " ") ?? "-"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Base price</span>
                  <p className="font-medium">
                    {formatCurrency(auction.startingAmount, auction.currency)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Earnest money</span>
                  <p className="font-medium">
                    {formatCurrency(auction.earnestAmount, auction.currency)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Max winners</span>
                  <p className="font-medium">{auction.maxWinners}</p>
                </div>
                {auction.minBidIncrement && (
                  <div>
                    <span className="text-gray-500">Min increment</span>
                    <p className="font-medium">
                      {formatCurrency(
                        auction.minBidIncrement,
                        auction.currency
                      )}
                    </p>
                  </div>
                )}
                {auction.minBidDecrement && (
                  <div>
                    <span className="text-gray-500">Min decrement</span>
                    <p className="font-medium">
                      {formatCurrency(
                        auction.minBidDecrement,
                        auction.currency
                      )}
                    </p>
                  </div>
                )}
                {auction.reservePrice && (
                  <div>
                    <span className="text-gray-500">Reserve price</span>
                    <p className="font-medium">
                      {formatCurrency(auction.reservePrice, auction.currency)}
                    </p>
                  </div>
                )}
              </div>
              {product?.description && (
                <div>
                  <span className="text-gray-500">Description</span>
                  <p className="mt-1 text-gray-700">{product.description}</p>
                </div>
              )}
              {auction.notes && (
                <div>
                  <span className="text-gray-500">Notes</span>
                  <p className="mt-1 text-gray-700">{auction.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <p className="text-gray-600">
                  Pay the earnest amount to unlock bidding for this auction.
                </p>
                <div>
                  <span className="text-gray-500">Status</span>
                  <p className="font-medium">
                    {myEnrollment
                      ? myEnrollment.status.replaceAll("_", " ")
                      : "Not enrolled"}
                  </p>
                </div>
                {!isAuthenticated && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                    ⚠️ Please{" "}
                    <Link
                      href={`/auth/signin?redirect=/bidding/${auctionId}`}
                      className="font-semibold underline"
                    >
                      sign in
                    </Link>{" "}
                    to enroll in this auction.
                  </p>
                )}
                <Button
                  onClick={handleEnroll}
                  disabled={
                    !isAuthenticated || enrollmentPending || hasActiveEnrollment
                  }
                >
                  {hasActiveEnrollment
                    ? "Already enrolled"
                    : enrollmentPending
                      ? "Processing..."
                      : !isAuthenticated
                        ? "Sign in to enroll"
                        : "Pay earnest money"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Place a bid</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmitBid}>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Bid amount
                    </label>
                    {minBidAmount !== null && (
                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        {auction.mode === "FORWARD" ? (
                          <>
                            Minimum:{" "}
                            <span className="font-semibold text-gray-700">
                              {formatCurrency(
                                minBidAmount.toString(),
                                auction.currency
                              )}
                            </span>{" "}
                            (Current + increment)
                          </>
                        ) : (
                          <>
                            Maximum:{" "}
                            <span className="font-semibold text-gray-700">
                              {formatCurrency(
                                minBidAmount.toString(),
                                auction.currency
                              )}
                            </span>{" "}
                            (Current - decrement)
                          </>
                        )}
                      </p>
                    )}
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={bidAmount}
                      onChange={(event) => setBidAmount(event.target.value)}
                      placeholder={
                        minBidAmount !== null
                          ? `Enter more than ${minBidAmount.toFixed(2)}`
                          : "Enter your bid"
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!canBid || placeBidMutation.isPending}
                  >
                    {placeBidMutation.isPending
                      ? "Submitting..."
                      : "Submit bid"}
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                      ⚠️ Please{" "}
                      <Link
                        href={`/auth/signin?redirect=/bidding/${auctionId}`}
                        className="font-semibold underline"
                      >
                        sign in
                      </Link>{" "}
                      to place bids.
                    </p>
                  )}
                  {isAuthenticated && !hasActiveEnrollment && (
                    <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                      ℹ️ Enrollment is required before you can bid. Pay the
                      earnest money above to get started.
                    </p>
                  )}
                  {auction.status !== "LIVE" && (
                    <p className="text-sm text-gray-500">
                      Bidding opens once the auction is live.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-gray-900">
                  {formatCurrency(currentAmount, auction.currency)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Leaderboard</CardTitle>
              <p className="text-sm text-gray-500">
                Last updated{" "}
                {formatDateTime(
                  snapshot?.updatedAt ?? auction.leaderboard?.updatedAt ?? null
                )}
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {bidders.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No bids have been recorded yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Bidder</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Sequence</TableHead>
                    <TableHead>Placed at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bidders.map((bid, index) => (
                    <TableRow key={bid.bidId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {bid.name ?? "Anonymous"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {bid.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{bid.amount}</TableCell>
                      <TableCell>{bid.sequence}</TableCell>
                      <TableCell>{formatDateTime(bid.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
