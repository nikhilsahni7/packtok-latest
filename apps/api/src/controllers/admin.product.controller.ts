/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarketplaceProductStatus } from "@packtok/db";
import { Request, Response } from "express";
import {
    approveSubmission,
    changeProductStatus,
    createProductAsAdmin,
    deleteProduct,
    getPendingSubmissions,
    getProductByIdForAdmin,
    listAllProductsForAdmin,
    rejectSubmission,
    updateProduct,
} from "../services/product.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
    uploadDocumentToSupabase,
    uploadImageToSupabase,
    uploadThumbnailImageToSupabase,
    uploadVideoToSupabase,
} from "../utils/storage.service";

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

export const adminCreateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { imagesUrls, videoUrl, pdfUrl, imagesThumbnail, videoThumbnail } =
      await processUploadedMedia(req.files);
    const body: any = { ...req.body, images: imagesUrls, videoUrl };
    // Parse JSON strings to proper types
    if (body.specifications && typeof body.specifications === "string") {
      try {
        body.specifications = JSON.parse(body.specifications);
      } catch (err) {
        throw new Error("Invalid JSON in specifications field");
      }
    }
    // Parse FAQs JSON
    if (body.faqs && typeof body.faqs === "string") {
      try {
        body.faqs = JSON.parse(body.faqs);
      } catch (err) {
        throw new Error("Invalid JSON in faqs field");
      }
    }
    if (body.quantity) body.quantity = Number(body.quantity);
    if (body.year) body.year = Number(body.year);
    if (pdfUrl) body.pdfUrl = pdfUrl;
    if (imagesThumbnail) body.imagesThumbnail = imagesThumbnail;
    if (videoThumbnail) body.videoThumbnail = videoThumbnail;
    const product = await createProductAsAdmin(req.user!.id, body);
    res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  }
);

export const adminUpdateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { imagesUrls, videoUrl, pdfUrl, imagesThumbnail, videoThumbnail } =
      await processUploadedMedia(req.files);
    const data: any = { ...req.body };
    // Parse JSON strings to proper types
    if (data.specifications && typeof data.specifications === "string") {
      try {
        data.specifications = JSON.parse(data.specifications);
      } catch (err) {
        throw new Error("Invalid JSON in specifications field");
      }
    }
    // Parse FAQs JSON
    if (data.faqs && typeof data.faqs === "string") {
      try {
        data.faqs = JSON.parse(data.faqs);
      } catch (err) {
        throw new Error("Invalid JSON in faqs field");
      }
    }
    if (data.quantity) data.quantity = Number(data.quantity);
    if (data.year) data.year = Number(data.year);
    if (imagesUrls.length) data.images = imagesUrls;
    if (videoUrl) data.videoUrl = videoUrl;
    if (pdfUrl) data.pdfUrl = pdfUrl;
    if (imagesThumbnail) data.imagesThumbnail = imagesThumbnail;
    if (videoThumbnail) data.videoThumbnail = videoThumbnail;
    const updated = await updateProduct(id, data);
    res
      .status(200)
      .json(new ApiResponse(200, updated, "Product updated successfully"));
  }
);

export const adminListProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await listAllProductsForAdmin();
    res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
  }
);

export const adminGetProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductByIdForAdmin(id);
    res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  }
);

export const adminUpdateProductStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!Object.values(MarketplaceProductStatus).includes(status)) {
      throw new Error("Invalid status value");
    }
    const updated = await changeProductStatus(id, status);
    res
      .status(200)
      .json(new ApiResponse(200, updated, "Product status updated"));
  }
);

export const adminGetPendingSubmissions = asyncHandler(
  async (_req: Request, res: Response) => {
    const submissions = await getPendingSubmissions();
    res
      .status(200)
      .json(new ApiResponse(200, submissions, "Pending submissions fetched"));
  }
);

export const adminApproveSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { notes } = (req.body || {}) as { notes?: string };
    const updated = await approveSubmission(id, req.user!.id, notes);
    res.status(200).json(new ApiResponse(200, updated, "Submission approved"));
  }
);

export const adminRejectSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { notes } = (req.body || {}) as { notes?: string };
    const updated = await rejectSubmission(id, req.user!.id, notes);
    res.status(200).json(new ApiResponse(200, updated, "Submission rejected"));
  }
);

export const adminDeleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteProduct(id, req.user!.id, req.user!.role as any);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  }
);
