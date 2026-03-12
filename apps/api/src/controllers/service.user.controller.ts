import { Request, Response } from "express";
import { getRequestById } from "../services/admin/serviceRequests.service";
import {
  cancelUserServiceRequest,
  createMachineryInstallerRequest,
  createCompanyAcquisitionInquiry,
  createConsultancyRequest,
  createJobSeekerProfile,
  createMaintenanceRequest,
  createManpowerHiringRequest,
  createTurnkeyProjectInquiry,
  getUserServiceRequests
} from "../services/user/serviceRequests.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  uploadDocumentToSupabase,
  uploadImageToSupabase,
  uploadVideoToSupabase,
} from "../utils/storage.service";

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

export const submitMachineryInstaller = asyncHandler(
  async (req: Request, res: Response) => {
    const files = (req.files || {}) as {
      [key: string]: Express.Multer.File[];
    };
    const machineImages = files.machineImages || [];
    const machineVideos = files.machineVideos || [];

    const machineImageUrls = await Promise.all(
      machineImages.map((file) =>
        uploadImageToSupabase(
          file.buffer,
          file.mimetype,
          "services/machinery-installer/images"
        )
      )
    );

    const machineVideoUrls = await Promise.all(
      machineVideos.map((file) =>
        uploadVideoToSupabase(
          file.buffer,
          file.mimetype,
          "services/machinery-installer/videos"
        )
      )
    );

    const body = req.body as Record<string, string | undefined>;
    const request = await createMachineryInstallerRequest(req.user!.id, {
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      phone: body.phone,
      email: body.email,
      companyAddress: body.companyAddress,
      installationTypeRequired: body.installationTypeRequired,
      expectedTimeline: body.expectedTimeline,
      specificInstructions: body.specificInstructions,
      machineImageUrls,
      machineVideoUrls,
      machineTypeModel: body.machineTypeModel,
      capacitySpecifications: body.capacitySpecifications,
      fromLocation: body.fromLocation,
      preferredInstallationDateTime: body.preferredInstallationDateTime
        ? new Date(body.preferredInstallationDateTime)
        : undefined,
      whereLocation: body.whereLocation,
      additionalDescription: body.additionalDescription,
      teamMembersRequired: Number.parseInt(body.teamMembersRequired || "0", 10),
      skillsExpertiseNeeded: body.skillsExpertiseNeeded,
      onSiteSupportProvidedByClient: body.onSiteSupportProvidedByClient,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, request, "Machinery installer request submitted")
      );
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

export const cancelMyServiceRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Cancellation reason is required"));
    }

    const updated = await cancelUserServiceRequest(
      req.user!.id,
      id,
      reason.trim()
    );
    res
      .status(200)
      .json(new ApiResponse(200, updated, "Service request cancelled"));
  }
);
