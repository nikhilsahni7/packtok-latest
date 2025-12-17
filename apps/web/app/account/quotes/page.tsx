"use client";

import api from "@/lib/axios";
import { FileText, Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type QuoteStatus = "PENDING" | "REVIEWED" | "COMPLETED" | "CANCELLED";

interface QuoteRequest {
  id: string;
  companyName: string;
  message: string;
  status: QuoteStatus;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    images?: string[];
    imagesThumbnail?: string;
  };
  response?: string;
  respondedAt?: string;
}

const statusConfig: Record<QuoteStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "Pending", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  REVIEWED: { label: "Reviewed", color: "text-blue-700", bgColor: "bg-blue-100" },
  COMPLETED: { label: "Completed", color: "text-green-700", bgColor: "bg-green-100" },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bgColor: "bg-red-100" },
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await api.get<{ data: QuoteRequest[] }>("/api/v1/quotes/my");
      setQuotes(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch quotes:", error);
      toast.error(error?.response?.data?.message || "Failed to load quote requests");
    } finally {
      setIsLoading(false);
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
        <Link href="/marketplace" className="text-orange-600 hover:underline text-sm">
          Browse Products →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            activeTab === "pending" ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pending ({quotes.filter(q => q.status === "PENDING" || q.status === "REVIEWED").length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            activeTab === "completed" ? "bg-orange-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Completed ({quotes.filter(q => q.status === "COMPLETED" || q.status === "CANCELLED").length})
        </button>
      </div>

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-2xl">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No quote requests</h3>
          <p className="text-gray-500">
            {activeTab === "pending"
              ? "You don't have any pending quote requests"
              : "You don't have any completed quote requests"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => {
            const config = statusConfig[quote.status];
            return (
              <div
                key={quote.id}
                onClick={() => setSelectedQuote(quote)}
                className="bg-white border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
                    {quote.product?.imagesThumbnail || quote.product?.images?.[0] ? (
                      <Image
                        src={quote.product.imagesThumbnail || quote.product.images![0]}
                        alt={quote.product.title || "Product"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold line-clamp-1">{quote.product?.title || "Product"}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Company: {quote.companyName}</p>
                    <p className="text-xs text-gray-500">
                      Requested: {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Message:</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{quote.message}</p>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                  <span>ID: {quote.id.slice(0, 8)}</span>
                  <span className="text-orange-600 font-medium">View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedQuote(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-bold text-lg">Quote Details</h3>
                <p className="text-sm text-gray-500">ID: {selectedQuote.id.slice(0, 8)}</p>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="p-2 hover:bg-gray-100 rounded-full text-xl font-bold">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
                  {selectedQuote.product?.imagesThumbnail || selectedQuote.product?.images?.[0] ? (
                    <Image
                      src={selectedQuote.product.imagesThumbnail || selectedQuote.product.images![0]}
                      alt={selectedQuote.product.title || "Product"}
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
                <div>
                  <h4 className="font-semibold">{selectedQuote.product?.title}</h4>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedQuote.status].bgColor} ${statusConfig[selectedQuote.status].color}`}>
                    {statusConfig[selectedQuote.status].label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="font-medium">{selectedQuote.companyName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Submitted</p>
                  <p>{new Date(selectedQuote.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-1">Your Message</p>
                  <p className="text-sm">{selectedQuote.message}</p>
                </div>
                {selectedQuote.response && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-700 mb-1">Response from Packtok</p>
                    <p className="text-sm">{selectedQuote.response}</p>
                    {selectedQuote.respondedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Responded: {new Date(selectedQuote.respondedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
