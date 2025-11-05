import { Request, Response } from "express";
import { getRequestById } from "../services/admin/serviceRequests.service";
import {
  createCompanyAcquisitionInquiry,
  createConsultancyRequest,
  createJobSeekerProfile,
  createMaintenanceRequest,
  createManpowerHiringRequest,
  createTurnkeyProjectInquiry,
  getUserServiceRequests,
} from "../services/user/serviceRequests.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadDocumentToSupabase } from "../utils/storage.service";

export const submitMaintenance = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body; // expect all MaintenanceRequest fields
    const request = await createMaintenanceRequest(req.user!.id, data as any);
    res
      .status(201)
      .json(new ApiResponse(201, request, "Maintenance request submitted"));
  }
);
export const submitConsultancy = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const request = await createConsultancyRequest(req.user!.id, data as any);
    res
      .status(201)
      .json(new ApiResponse(201, request, "Consultancy request submitted"));
  }
);

export const submitTurnkey = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const request = await createTurnkeyProjectInquiry(
      req.user!.id,
      data as any
    );
    res
      .status(201)
      .json(new ApiResponse(201, request, "Turnkey project inquiry submitted"));
  }
);

export const submitAcquisition = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const request = await createCompanyAcquisitionInquiry(
      req.user!.id,
      data as any
    );
    res
      .status(201)
      .json(
        new ApiResponse(201, request, "Company acquisition inquiry submitted")
      );
  }
);

export const submitManpower = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const request = await createManpowerHiringRequest(
      req.user!.id,
      data as any
    );
    res
      .status(201)
      .json(new ApiResponse(201, request, "Manpower hiring request submitted"));
  }
);

export const submitJobSeeker = asyncHandler(
  async (req: Request, res: Response) => {
    const rest = { ...req.body } as any;
    let cvUrl: string | undefined;
    if ((req as any).file) {
      const file = (req as any).file as any;
      cvUrl = await uploadDocumentToSupabase(file.buffer, file.mimetype, "cvs");
    }

    // Convert string boolean to actual boolean for multipart form data
    const jobSeekerData = {
      ...rest,
      cvUrl,
      hasPreviouslyWorkedWithUs:
        rest.hasPreviouslyWorkedWithUs === "true" ||
        rest.hasPreviouslyWorkedWithUs === true,
    };

    const request = await createJobSeekerProfile(
      req.user!.id,
      jobSeekerData as any
    );
    res
      .status(201)
      .json(new ApiResponse(201, request, "Job seeker profile submitted"));
  }
);

export const listMyServiceRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const requests = await getUserServiceRequests(req.user!.id);
    res
      .status(200)
      .json(new ApiResponse(200, requests, "Service requests fetched"));
  }
);

export const getMyServiceRequestDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const request = await getRequestById(id);

    // Verify the request belongs to the user
    if (request.userId !== req.user!.id) {
      return res.status(403).json(new ApiResponse(403, null, "Unauthorized"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, request, "Service request details fetched"));
  }
);
