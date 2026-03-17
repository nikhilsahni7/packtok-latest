import {
  AppNotification,
  NotificationAudience,
  NotificationType,
  Prisma,
  Role,
  prisma,
} from "@packtok/db";
import { ApiError } from "../utils/apiError";

type UserNotificationQuery = {
  userId: string;
  role: Role;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
};

type CreateNotificationInput = {
  title: string;
  message: string;
  type: NotificationType;
  audience?: NotificationAudience;
  roleFilter?: Role;
  targetUserIds?: string[];
  payload?: Prisma.JsonValue;
  actionUrl?: string;
  expiresAt?: Date;
  createdById?: string;
};

type AdminCustomNotificationInput = {
  title: string;
  message: string;
  audience?: NotificationAudience;
  targetUserIds?: string[];
  roleFilter?: Role;
  payload?: Prisma.JsonValue;
  actionUrl?: string;
  expiresAt?: Date;
  createdById?: string;
};

type UserVisibleNotification = AppNotification & {
  reads: { id: string; readAt: Date }[];
};

// Hook point for future channels (push/email/etc). Keep this as a single dispatch path.
const dispatchToSecondaryChannels = async (_notification: AppNotification) => {
  return;
};

const roleAudienceMap: Record<Role, NotificationAudience[]> = {
  NORMAL_USER: [
    NotificationAudience.ALL_USERS,
    NotificationAudience.NORMAL_USERS,
  ],
  VENDOR: [NotificationAudience.ALL_USERS, NotificationAudience.VENDORS],
  ADMIN: [NotificationAudience.ALL_USERS, NotificationAudience.ADMINS],
  SUPER_ADMIN: [NotificationAudience.ALL_USERS, NotificationAudience.ADMINS],
};

const buildVisibleWhere = (
  userId: string,
  role: Role
): Prisma.AppNotificationWhereInput => ({
  isActive: true,
  OR: [
    { audience: { in: roleAudienceMap[role] } },
    {
      audience: NotificationAudience.CUSTOM_USERS,
      targetUserIds: { has: userId },
    },
  ],
  AND: [
    {
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    {
      OR: [{ roleFilter: null }, { roleFilter: role }],
    },
  ],
});

const mapForUser = (notification: UserVisibleNotification) => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  type: notification.type,
  payload: notification.payload,
  actionUrl: notification.actionUrl,
  createdAt: notification.createdAt,
  read: notification.reads.length > 0,
  readAt: notification.reads[0]?.readAt ?? null,
});

export const createNotification = async (input: CreateNotificationInput) => {
  if (!input.title?.trim() || !input.message?.trim()) {
    throw new ApiError(400, "title and message are required");
  }

  if (
    input.audience === NotificationAudience.CUSTOM_USERS &&
    (!input.targetUserIds || input.targetUserIds.length === 0)
  ) {
    throw new ApiError(400, "targetUserIds are required for CUSTOM_USERS");
  }

  const payloadInput = input.payload === null ? Prisma.JsonNull : input.payload;

  const notification = await prisma.appNotification.create({
    data: {
      title: input.title.trim(),
      message: input.message.trim(),
      type: input.type,
      audience: input.audience ?? NotificationAudience.ALL_USERS,
      roleFilter: input.roleFilter,
      targetUserIds: input.targetUserIds ?? [],
      payload: payloadInput,
      actionUrl: input.actionUrl,
      expiresAt: input.expiresAt,
      createdById: input.createdById,
    },
  });

  await dispatchToSecondaryChannels(notification);
  return notification;
};

export const sendAdminCustomNotification = async (
  input: AdminCustomNotificationInput
) => {
  return createNotification({
    ...input,
    type: NotificationType.CUSTOM,
    audience: input.audience ?? NotificationAudience.ALL_USERS,
  });
};

export const listNotificationsForUser = async (
  query: UserNotificationQuery
) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit =
    query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 20;
  const skip = (page - 1) * limit;

  const where: Prisma.AppNotificationWhereInput = {
    ...buildVisibleWhere(query.userId, query.role),
    ...(query.unreadOnly
      ? {
          reads: {
            none: {
              userId: query.userId,
            },
          },
        }
      : {}),
  };

  const [items, total, unreadCount] = await Promise.all([
    prisma.appNotification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        reads: {
          where: { userId: query.userId },
          select: { id: true, readAt: true },
        },
      },
    }),
    prisma.appNotification.count({ where }),
    countUnreadNotifications(query.userId, query.role),
  ]);

  return {
    data: items.map((item) => mapForUser(item as UserVisibleNotification)),
    meta: {
      page,
      limit,
      total,
      unreadCount,
      hasNext: skip + items.length < total,
    },
  };
};

export const countUnreadNotifications = async (userId: string, role: Role) => {
  return prisma.appNotification.count({
    where: {
      ...buildVisibleWhere(userId, role),
      reads: {
        none: {
          userId,
        },
      },
    },
  });
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
  role: Role
) => {
  const notification = await prisma.appNotification.findFirst({
    where: {
      id: notificationId,
      ...buildVisibleWhere(userId, role),
    },
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  await prisma.notificationRead.upsert({
    where: {
      notificationId_userId: {
        notificationId,
        userId,
      },
    },
    create: {
      notificationId,
      userId,
    },
    update: {
      readAt: new Date(),
    },
  });

  return { success: true };
};

export const markAllNotificationsAsRead = async (
  userId: string,
  role: Role
) => {
  const unread = await prisma.appNotification.findMany({
    where: {
      ...buildVisibleWhere(userId, role),
      reads: {
        none: {
          userId,
        },
      },
    },
    select: { id: true },
  });

  if (unread.length === 0) {
    return { marked: 0 };
  }

  await prisma.notificationRead.createMany({
    data: unread.map((n) => ({
      notificationId: n.id,
      userId,
      readAt: new Date(),
    })),
    skipDuplicates: true,
  });

  return { marked: unread.length };
};

export const listNotificationsForAdmin = async (page = 1, limit = 20) => {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? Math.min(limit, 100) : 20;
  const skip = (safePage - 1) * safeLimit;

  const [data, total] = await Promise.all([
    prisma.appNotification.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
      include: {
        _count: {
          select: {
            reads: true,
          },
        },
      },
    }),
    prisma.appNotification.count(),
  ]);

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      hasNext: skip + data.length < total,
    },
  };
};

export const notifyProductLive = async (input: {
  productId: string;
  title: string;
  productType?: string;
  categoryName?: string;
}) => {
  return createNotification({
    title: "New Product Is Live",
    message: `${input.title} is now live on marketplace${input.categoryName ? ` in ${input.categoryName}` : ""}.`,
    type: NotificationType.PRODUCT_LIVE,
    audience: NotificationAudience.ALL_USERS,
    payload: {
      productId: input.productId,
      productType: input.productType ?? null,
      categoryName: input.categoryName ?? null,
    },
    actionUrl: `/marketplace/product/${input.productId}`,
  });
};

export const notifyPodcastLive = async (input: {
  podcastId: string;
  title: string;
}) => {
  return createNotification({
    title: "New Podcast Is Live",
    message: `${input.title} is now published and ready to watch.`,
    type: NotificationType.PODCAST_LIVE,
    audience: NotificationAudience.ALL_USERS,
    payload: {
      podcastId: input.podcastId,
    },
    actionUrl: `/podcasts/${input.podcastId}`,
  });
};

export const notifyArticlePublished = async (input: {
  articleId: string;
  title: string;
}) => {
  return createNotification({
    title: "New Article Published",
    message: `${input.title} has just been published.`,
    type: NotificationType.ARTICLE_PUBLISHED,
    audience: NotificationAudience.ALL_USERS,
    payload: {
      articleId: input.articleId,
    },
    actionUrl: `/articles/${input.articleId}`,
  });
};

export const notifyAuctionProductAdded = async (input: {
  auctionId: string;
  productId: string;
  productTitle: string;
}) => {
  return createNotification({
    title: "New Auction Listing",
    message: `${input.productTitle} has been added to auction.`,
    type: NotificationType.AUCTION_PRODUCT_ADDED,
    audience: NotificationAudience.ALL_USERS,
    payload: {
      auctionId: input.auctionId,
      productId: input.productId,
    },
    actionUrl: `/bidding?auctionId=${input.auctionId}`,
  });
};

export const notifyAuctionLive = async (input: {
  auctionId: string;
  productId: string;
  productTitle: string;
}) => {
  return createNotification({
    title: "Auction Is Live",
    message: `${input.productTitle} auction is now live. Join now.`,
    type: NotificationType.AUCTION_LIVE,
    audience: NotificationAudience.ALL_USERS,
    payload: {
      auctionId: input.auctionId,
      productId: input.productId,
    },
    actionUrl: `/bidding?auctionId=${input.auctionId}`,
  });
};
