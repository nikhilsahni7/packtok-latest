import { Request, Response } from "express";
import {
    deleteUserForAdmin,
    getUserByIdForAdmin,
    listAllUsersForAdmin,
    updateUserForAdmin,
} from "../services/admin.user.service";
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

export const adminUpdateUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, phone_number, role, country } = req.body;
    const user = await updateUserForAdmin(id, { name, phone_number, role, country });
    res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  }
);

export const adminDeleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteUserForAdmin(id);
    res
      .status(200)
      .json(new ApiResponse(200, null, "User deleted successfully"));
  }
);
