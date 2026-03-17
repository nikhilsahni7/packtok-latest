import { Request, Response } from "express";
import {
  countUnreadNotifications,
  listNotificationsForUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getMyNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const unreadOnly =
      String(req.query.tab || "all").toLowerCase() === "unread";
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await listNotificationsForUser({
      userId: req.user!.id,
      role: req.user!.role,
      page,
      limit,
      unreadOnly,
    });

    res.status(200).json(new ApiResponse(200, result, "Notifications fetched"));
  }
);

export const getUnreadNotificationCount = asyncHandler(
  async (req: Request, res: Response) => {
    const count = await countUnreadNotifications(req.user!.id, req.user!.role);
    res
      .status(200)
      .json(
        new ApiResponse(200, { unreadCount: count }, "Unread count fetched")
      );
  }
);

export const readNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await markNotificationAsRead(
      id,
      req.user!.id,
      req.user!.role
    );
    res
      .status(200)
      .json(new ApiResponse(200, result, "Notification marked as read"));
  }
);

export const readAllNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await markAllNotificationsAsRead(
      req.user!.id,
      req.user!.role
    );
    res
      .status(200)
      .json(new ApiResponse(200, result, "All notifications marked as read"));
  }
);
