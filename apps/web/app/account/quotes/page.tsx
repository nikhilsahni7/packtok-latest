"use client";

import api from "@/lib/axios";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Package,
  Send,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { QuoteRequest, QuoteStatus } from "@/types/marketplace";

const statusConfig: Record<
  QuoteStatus,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  REVIEWED: {
    label: "Reviewed",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await api.get<{ data: QuoteRequest[] }>("/api/v1/quotes/my");
      setQuotes(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch quotes:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load quote requests"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    setIsCancelling(true);
    try {
      await api.put(`/api/v1/quotes/${id}/cancel`, {
        reason: cancelReason.trim(),
      });
      toast.success("Quote request cancelled");
      setCancellingId(null);
      setCancelReason("");
      fetchQuotes();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel request");
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (activeTab === "pending") {
      return quote.status === "PENDING" || quote.status === "REVIEWED";
    }
    return quote.status === "COMPLETED" || quote.status === "CANCELLED";
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Quote Requests</h2>
        <Link
          href="/marketplace"
          className="text-orange-600 hover:underline text-sm font-medium"
        >
          Browse Products →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl gap-1">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "pending"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending ({quotes.filter((q) => q.status === "PENDING" || q.status === "REVIEWED").length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "completed"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          History ({quotes.filter((q) => q.status === "COMPLETED" || q.status === "CANCELLED").length})
        </button>
      </div>

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No quote requests</h3>
          <p className="text-gray-500 text-sm">
            {activeTab === "pending"
              ? "You don't have any active quote requests"
              : "No quote request history found"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => {
            const config = statusConfig[quote.status];
            const isExpanded = expandedId === quote.id;
            const isCancellingThis = cancellingId === quote.id;

            return (
              <div
                key={quote.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all hover:shadow-sm ${
                  quote.status === "CANCELLED" ? "opacity-75" : ""
                }`}
              >
                {/* Header Card */}
                <div className="p-5">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
                      {quote.product?.imagesThumbnail ||
                      quote.product?.images?.[0] ? (
                        <Image
                          src={
                            quote.product.imagesThumbnail ||
                            quote.product.images![0]
                          }
                          alt={quote.product.title || "Product"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-gray-900 truncate pr-2">
                          {quote.product?.title || "Product Request"}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${config.bgColor} ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {quote.companyName}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 font-medium">
                        <span>ID: #{quote.id.slice(0, 8).toUpperCase()}</span>
                        <span>•</span>
                        <span>
                          {new Date(quote.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Your Message
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {quote.message}
                    </p>
                  </div>

                  {/* Rejection/Cancellation Reason */}
                  {quote.status === "CANCELLED" && quote.cancellationReason && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
                          Cancellation Reason
                        </p>
                        <p className="text-sm text-red-600">
                          {quote.cancellationReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-xs font-bold transition-all"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" /> Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" /> View Details
                        </>
                      )}
                    </button>

                    {quote.status === "PENDING" && (
                      <button
                        onClick={() =>
                          setCancellingId(isCancellingThis ? null : quote.id)
                        }
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-bold transition-all"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Withdraw Request
                      </button>
                    )}

                    {quote.product?.id && (
                      <Link
                        href={`/marketplace/${
                          quote.product.category?.name
                            ? quote.product.category.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            : "all"
                        }/${quote.product.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-bold transition-all"
                      >
                        Visit Product
                      </Link>
                    )}
                  </div>
                </div>

                {/* Cancellation Dialog */}
                {isCancellingThis && (
                  <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                        Reason for Withdrawal
                      </label>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Please tell us why you're cancelling this request..."
                        rows={3}
                        className="w-full border border-red-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleCancel(quote.id)}
                          disabled={isCancelling}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-bold shadow-sm disabled:opacity-50"
                        >
                          {isCancelling ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          Confirm Withdrawal
                        </button>
                        <button
                          onClick={() => {
                            setCancellingId(null);
                            setCancelReason("");
                          }}
                          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-bold"
                        >
                          Keep Request
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t bg-gray-50/50 p-5 space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Submitted Details
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DetailCard label="Company" value={quote.companyName} />
                        <DetailCard label="Contact Phone" value={quote.phone} />
                        <DetailCard label="Email Address" value={quote.email} />
                        <div className="sm:col-span-2 lg:col-span-3">
                          <DetailCard label="Full Address" value={quote.address} />
                        </div>
                        {quote.additionalInfo && (
                          <div className="sm:col-span-2 lg:col-span-3">
                            <DetailCard
                              label="Additional Information"
                              value={quote.additionalInfo}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {quote.response && (
                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                            Response from Packtok
                          </h5>
                          {quote.respondedAt && (
                            <span className="text-[10px] text-orange-400 font-bold">
                              {new Date(quote.respondedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-orange-900 leading-relaxed">
                          {quote.response}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-900 font-semibold break-words">{value}</p>
    </div>
  );
}
