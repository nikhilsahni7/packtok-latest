import { prisma } from "@packtok/db";
import { Request, Response } from "express";
import {
    applyForVendor,
    approveVendorApplication,
    listVendorApplications,
    rejectVendorApplication,
} from "../services/vendor.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const applyVendor = asyncHandler(async (req: Request, res: Response) => {
  const { companyName, notes } = (req.body ?? {}) as {
    companyName?: string;
    notes?: string;
  };
  const app = await applyForVendor(req.user!.id, companyName, notes);
  res
    .status(201)
    .json(
      new ApiResponse(201, app, "Vendor application submitted (or updated)")
    );
});

export const adminListVendorApplications = asyncHandler(
  async (_req: Request, res: Response) => {
    const apps = await listVendorApplications();
    res
      .status(200)
      .json(new ApiResponse(200, apps, "Vendor applications fetched"));
  }
);

export const adminApproveVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const app = await approveVendorApplication(id);
    res
      .status(200)
      .json(new ApiResponse(200, app, "Vendor application approved"));
  }
);

export const adminRejectVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };
    const app = await rejectVendorApplication(id, reason);
    res
      .status(200)
      .json(new ApiResponse(200, app, "Vendor application rejected"));
  }
);

export const getMyVendorApplication = asyncHandler(
  async (req: Request, res: Response) => {
    const app = await prisma.vendorApplication.findUnique({
      where: { userId: req.user!.id },
    });
    res
      .status(200)
      .json(new ApiResponse(200, app, "Vendor application status"));
  }
);
