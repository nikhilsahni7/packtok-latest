"use client";

import {
  ProductSubmissionHistoryItem,
  useMyProductSubmissions,
} from "@/hooks/useProducts";
import { CheckCircle2, Clock3, Loader2, Package, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const productTypeRouteMap: Record<string, string> = {
  MACHINERY: "machinery",
  SPARE_PARTS: "spare-parts",
  CONSUMABLES: "consumables",
  RAW_MATERIALS: "raw-materials",
};

const submissionStatusConfig: Record<
  string,
  { label: string; badgeClass: string; icon: typeof Clock3 }
> = {
  PENDING_APPROVAL: {
    label: "Pending Approval",
    badgeClass: "bg-yellow-100 text-yellow-700",
    icon: Clock3,
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    badgeClass: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const formatPrice = (item: ProductSubmissionHistoryItem) => {
  if (!item.price) return "Price unavailable";
  const amount = Number(item.price);
  if (!Number.isFinite(amount))
    return `${item.currency || "INR"} ${item.price}`;
  return `${item.currency || "INR"} ${amount.toLocaleString("en-IN")}`;
};

const getProductRoute = (item: ProductSubmissionHistoryItem) => {
  const typeSlug = productTypeRouteMap[item.productType] || "machinery";
  return `/marketplace/${typeSlug}/${item.id}`;
};

export default function SellItemsHistoryPage() {
  const { data, isLoading } = useMyProductSubmissions();
  const [activeTab, setActiveTab] = useState<
    "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
  >("PENDING_APPROVAL");

  const items = data || [];

  const counts = useMemo(() => {
    return {
      pending: items.filter((i) => i.submissionStatus === "PENDING_APPROVAL")
        .length,
      approved: items.filter((i) => i.submissionStatus === "APPROVED").length,
      rejected: items.filter((i) => i.submissionStatus === "REJECTED").length,
    };
  }, [items]);

  const filteredItems = useMemo(
    () => items.filter((i) => i.submissionStatus === activeTab),
    [activeTab, items]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Sell Old Items Status
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Track approval updates for the products you submitted.
        </p>
      </div>

      <div className="flex p-1 bg-gray-100 rounded-xl gap-1 w-full max-w-xl">
        <button
          onClick={() => setActiveTab("PENDING_APPROVAL")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "PENDING_APPROVAL"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending ({counts.pending})
        </button>
        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "APPROVED"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Approved ({counts.approved})
        </button>
        <button
          onClick={() => setActiveTab("REJECTED")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "REJECTED"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Rejected ({counts.rejected})
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            No submissions found
          </h3>
          <p className="text-gray-500 text-sm">
            No products in this status yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const statusMeta =
              submissionStatusConfig[item.submissionStatus] ||
              submissionStatusConfig.PENDING_APPROVAL;
            const StatusIcon = statusMeta.icon;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.imagesThumbnail ? (
                      <Image
                        src={item.imagesThumbnail}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.productType.replaceAll("_", " ")}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                      <p className="text-gray-600">
                        Price: {formatPrice(item)}
                      </p>
                      <p className="text-gray-600">
                        Submitted:{" "}
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </p>
                      {item.reviewedAt ? (
                        <p className="text-gray-600">
                          Reviewed:{" "}
                          {new Date(item.reviewedAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </p>
                      ) : null}
                    </div>

                    {item.reviewNotes ? (
                      <div className="mt-3 rounded-lg bg-gray-50 border border-gray-100 p-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Admin Notes
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {item.reviewNotes}
                        </p>
                      </div>
                    ) : null}

                    {item.submissionStatus !== "PENDING_APPROVAL" ? (
                      <div className="mt-4">
                        <Link
                          href={getProductRoute(item)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                          View Product
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
