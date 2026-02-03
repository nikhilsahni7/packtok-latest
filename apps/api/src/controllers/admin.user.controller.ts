import { Request, Response } from "express";
import { getUserByIdForAdmin, listAllUsersForAdmin } from "../services/admin.user.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const adminListUsers = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await listAllUsersForAdmin();
    res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  }
);

export const adminGetUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getUserByIdForAdmin(id);
    res
      .status(200)
      .json(new ApiResponse(200, user, "User details fetched successfully"));
  }
);
