import { NotificationAudience, NotificationType, Role } from "@packtok/db";
import { Request, Response } from "express";
import {
  listNotificationsForAdmin,
  sendAdminCustomNotification,
} from "../services/notification.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const parseAudience = (value: unknown): NotificationAudience | undefined => {
  if (!value) return undefined;
  if (
    Object.values(NotificationAudience).includes(value as NotificationAudience)
  ) {
    return value as NotificationAudience;
  }
  throw new ApiError(400, "Invalid audience value");
};

const parseRole = (value: unknown): Role | undefined => {
  if (!value) return undefined;
  if (Object.values(Role).includes(value as Role)) {
    return value as Role;
  }
  throw new ApiError(400, "Invalid roleFilter value");
};

export const adminSendCustomNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      message,
      audience,
      targetUserIds,
      roleFilter,
      payload,
      actionUrl,
      expiresAt,
    } = req.body || {};

    if (!title || !message) {
      throw new ApiError(400, "title and message are required");
    }

    const parsedAudience =
      parseAudience(audience) ?? NotificationAudience.ALL_USERS;

    const notification = await sendAdminCustomNotification({
      title,
      message,
      audience: parsedAudience,
      targetUserIds: Array.isArray(targetUserIds) ? targetUserIds : undefined,
      roleFilter: parseRole(roleFilter),
      payload,
      actionUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdById: req.user!.id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, notification, "Custom notification sent"));
  }
);

export const adminListNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await listNotificationsForAdmin(page, limit);
    res.status(200).json(new ApiResponse(200, result, "Notifications fetched"));
  }
);

export const adminSupportedNotificationTypes = asyncHandler(
  async (_req: Request, res: Response) => {
    res.status(200).json(
      new ApiResponse(
        200,
        {
          types: Object.values(NotificationType),
          audiences: Object.values(NotificationAudience),
          roles: Object.values(Role),
        },
        "Notification metadata fetched"
      )
    );
  }
);
