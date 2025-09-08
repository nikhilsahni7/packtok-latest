import {
  MarketplaceProductStatus,
  StockMovementReason,
  UserSubmissionStatus,
} from "@packtok/db";
import { Request, Response } from "express";
import {
  adjustInventory,
  createVendorDraft,
  deleteOwnProduct,
  getInventory,
  getOwnProduct,
  listOwnProducts,
  removeGalleryImageForOwnProduct,
  submitOwnProductForReview,
  updateOwnProduct,
  uploadMediaForOwnProduct,
  upsertInventory,
} from "../services/vendor.product.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  uploadDocumentToSupabase,
  uploadImageToSupabase,
  uploadThumbnailImageToSupabase,
  uploadVideoToSupabase,
} from "../utils/storage.service";

export const vendorListProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, submissionStatus } = req.query as {
      status?: MarketplaceProductStatus;
      submissionStatus?: UserSubmissionStatus;
    };
    const items = await listOwnProducts(req.user!.id, {
      status,
      submissionStatus,
    });
    res.status(200).json(new ApiResponse(200, items, "Your products fetched"));
  }
);

export const vendorGetProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const item = await getOwnProduct(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, item, "Product fetched"));
  }
);

export const vendorUpdateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const data = { ...req.body };
    if (data.specifications && typeof data.specifications === "string") {
      try {
        data.specifications = JSON.parse(data.specifications);
      } catch {
        // ignore; service will keep original if invalid
      }
    }
    const updated = await updateOwnProduct(req.user!.id, req.params.id, data);
    res.status(200).json(new ApiResponse(200, updated, "Product updated"));
  }
);

export const vendorSubmitForReview = asyncHandler(
  async (req: Request, res: Response) => {
    const updated = await submitOwnProductForReview(
      req.user!.id,
      req.params.id
    );
    res
      .status(200)
      .json(new ApiResponse(200, updated, "Product submitted for review"));
  }
);

export const vendorDeleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteOwnProduct(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Product deleted"));
  }
);

// Inventory controllers
export const vendorGetInventory = asyncHandler(
  async (req: Request, res: Response) => {
    const inv = await getInventory(req.user!.id, req.params.id);
    res.status(200).json(new ApiResponse(200, inv, "Inventory fetched"));
  }
);

export const vendorUpsertInventory = asyncHandler(
  async (req: Request, res: Response) => {
    const inv = await upsertInventory(req.user!.id, req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, inv, "Inventory saved"));
  }
);

export const vendorAdjustInventory = asyncHandler(
  async (req: Request, res: Response) => {
    const { delta, reason, meta } = req.body as {
      delta: number;
      reason: StockMovementReason;
      meta?: unknown;
    };
    const result = await adjustInventory(
      req.user!.id,
      req.params.id,
      delta,
      reason,
      meta
    );
    res.status(200).json(new ApiResponse(200, result, "Inventory adjusted"));
  }
);

// Media controllers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processUploadedMedia = async (files: any) => {
  const imagesUrls: string[] = [];
  let videoUrl: string | undefined;
  let pdfUrl: string | undefined;
  let imagesThumbnail: string | undefined;
  let videoThumbnail: string | undefined;
  if (files?.images) {
    for (const file of files.images) {
      const url = await uploadImageToSupabase(file.buffer, file.mimetype);
      imagesUrls.push(url);
    }
  }
  if (files?.video && files.video[0]) {
    videoUrl = await uploadVideoToSupabase(
      files.video[0].buffer,
      files.video[0].mimetype
    );
  }
  if (files?.pdf && files.pdf[0]) {
    pdfUrl = await uploadDocumentToSupabase(
      files.pdf[0].buffer,
      files.pdf[0].mimetype
    );
  }
  if (files?.thumbnail && files.thumbnail[0]) {
    imagesThumbnail = await uploadThumbnailImageToSupabase(
      files.thumbnail[0].buffer,
      files.thumbnail[0].mimetype
    );
  }
  if (files?.videoThumbnail && files.videoThumbnail[0]) {
    videoThumbnail = await uploadThumbnailImageToSupabase(
      files.videoThumbnail[0].buffer,
      files.videoThumbnail[0].mimetype,
      "video-thumbnails"
    );
  }
  return { imagesUrls, videoUrl, pdfUrl, imagesThumbnail, videoThumbnail };
};

export const vendorUploadMedia = asyncHandler(
  async (req: Request, res: Response) => {
    const { imagesUrls, videoUrl, pdfUrl, imagesThumbnail, videoThumbnail } =
      await processUploadedMedia(req.files);
    const result = await uploadMediaForOwnProduct(req.user!.id, req.params.id, {
      images: imagesUrls,
      videoUrl,
      pdfUrl,
      imagesThumbnail,
      videoThumbnail,
    });
    res.status(200).json(new ApiResponse(200, result, "Media updated"));
  }
);

export const vendorRemoveGalleryImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { url } = req.query as { url?: string };
    if (!url) {
      throw new Error("Image URL is required");
    }
    const result = await removeGalleryImageForOwnProduct(
      req.user!.id,
      req.params.id,
      url
    );
    res.status(200).json(new ApiResponse(200, result, "Image removed"));
  }
);

export const vendorCreateDraft = asyncHandler(
  async (req: Request, res: Response) => {
    const draft = await createVendorDraft(req.user!.id, req.body);
    res.status(201).json(new ApiResponse(201, draft, "Draft created"));
  }
);
