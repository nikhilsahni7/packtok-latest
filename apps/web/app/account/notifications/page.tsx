"use client";

import {
  AppNotificationItem,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { Bell, FileText, Loader2, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const productTypeRouteMap: Record<string, string> = {
  MACHINERY: "machinery",
  SPARE_PARTS: "spare-parts",
  CONSUMABLES: "consumables",
  RAW_MATERIALS: "raw-materials",
};

const iconForType = (type: AppNotificationItem["type"]) => {
  switch (type) {
    case "PRODUCT_LIVE":
      return {
        icon: ShoppingBag,
        iconColor: "text-orange-600",
        bg: "bg-orange-100",
      };
    case "PODCAST_LIVE":
    case "ARTICLE_PUBLISHED":
      return {
        icon: FileText,
        iconColor: "text-blue-600",
        bg: "bg-blue-100",
      };
    case "AUCTION_PRODUCT_ADDED":
    case "AUCTION_LIVE":
      return {
        icon: Zap,
        iconColor: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    default:
      return {
        icon: Bell,
        iconColor: "text-gray-600",
        bg: "bg-gray-100",
      };
  }
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const resolveNotificationRoute = (item: AppNotificationItem): string | null => {
  const payload = (item.payload || {}) as Record<string, unknown>;

  if (item.type === "ARTICLE_PUBLISHED") {
    const articleId = payload.articleId as string | undefined;
    return articleId ? `/articles/${articleId}` : "/articles";
  }

  if (item.type === "PODCAST_LIVE") {
    const podcastId = payload.podcastId as string | undefined;
    return podcastId ? `/podcasts/${podcastId}` : "/podcasts";
  }

  if (item.type === "AUCTION_LIVE" || item.type === "AUCTION_PRODUCT_ADDED") {
    const auctionId = payload.auctionId as string | undefined;
    return auctionId ? `/bidding/${auctionId}` : "/bidding";
  }

  if (item.type === "PRODUCT_LIVE") {
    const productId = payload.productId as string | undefined;
    const productType = payload.productType as string | undefined;
    const productSlug = productType
      ? productTypeRouteMap[productType]
      : undefined;

    if (!productId || !productSlug) {
      return "/marketplace";
    }

    return `/marketplace/${productSlug}/${productId}`;
  }

  if (item.actionUrl) {
    if (item.actionUrl.includes("auctionId=")) {
      const auctionId = item.actionUrl.split("auctionId=")[1]?.split("&")[0];
      if (auctionId) return `/bidding/${auctionId}`;
    }
    if (item.actionUrl.startsWith("/bidding")) return "/bidding";
    if (item.actionUrl.startsWith("/podcasts")) return "/podcasts";
    if (item.actionUrl.startsWith("/articles")) return "/articles";
    if (item.actionUrl.startsWith("/marketplace")) return item.actionUrl;
  }

  return null;
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const { data, isLoading, isRefetching } = useNotifications(activeTab);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const notifications = data?.data || [];
  const unreadCount = data?.meta?.unreadCount || 0;

  const title = useMemo(
    () => (activeTab === "all" ? "All Notifications" : "Unread Notifications"),
    [activeTab]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => markAllRead()}
          disabled={isMarkingAll || unreadCount === 0}
        >
          {isMarkingAll ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="flex p-1 bg-gray-100 rounded-xl gap-1 max-w-sm">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "all"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "unread"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500 text-sm">
            {activeTab === "all"
              ? "You're all caught up."
              : "You have no unread notifications."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {isRefetching ? (
            <p className="text-xs text-gray-500">Refreshing...</p>
          ) : null}

          {notifications.map((item) => {
            const iconStyle = iconForType(item.type);
            const Icon = iconStyle.icon;
            const targetRoute = resolveNotificationRoute(item);

            const card = (
              <>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${iconStyle.bg}`}
                >
                  <Icon className={`h-5 w-5 ${iconStyle.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    {!item.read ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1 shrink-0" />
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </>
            );

            if (targetRoute) {
              return (
                <Link
                  key={item.id}
                  href={targetRoute}
                  onClick={() => {
                    if (!item.read) markRead(item.id);
                  }}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-colors hover:bg-gray-50 ${
                    item.read
                      ? "bg-white border-gray-200"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  {card}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!item.read) markRead(item.id);
                }}
                className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors hover:bg-gray-50 ${
                  item.read
                    ? "bg-white border-gray-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                {card}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
