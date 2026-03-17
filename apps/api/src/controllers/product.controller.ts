import { Request, Response } from "express";
import {
  createProductSubmission,
  getPublicProductById,
  getPublicProducts,
} from "../services/product.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  uploadDocumentToSupabase,
  uploadImageToSupabase,
  uploadThumbnailImageToSupabase,
  uploadVideoToSupabase,
} from "../utils/storage.service";

export const listProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      categoryId,
      subCategory,
      condition,
      machineType,
      productType,
      priceMin,
      priceMax,
      searchTerm,
      page,
      limit,
    } = req.query;

    // Helper function to parse array parameters
    const parseArrayParam = (param: any): string[] | string | undefined => {
      if (!param) return undefined;
      if (Array.isArray(param)) return param as string[];
      if (typeof param === "string" && param.includes(",")) {
        return param.split(",").map((item) => item.trim());
      }
      return param as string;
    };

    const result = await getPublicProducts({
      categoryId: parseArrayParam(categoryId),
      subCategory: parseArrayParam(subCategory),
      condition: parseArrayParam(condition),
      machineType: parseArrayParam(machineType),
      productType: parseArrayParam(productType),
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      searchTerm: searchTerm as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Products fetched successfully"));
  }
);

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getPublicProductById(id);
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

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

export const submitProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { imagesUrls, videoUrl, pdfUrl, imagesThumbnail, videoThumbnail } =
      await processUploadedMedia(req.files);
    const body: any = { ...req.body, images: imagesUrls, videoUrl, pdfUrl };
    // Parse specifications JSON string if present
    if (body.specifications && typeof body.specifications === "string") {
      try {
        body.specifications = JSON.parse(body.specifications);
      } catch {
        throw new Error("Invalid JSON in specifications field");
      }
    }
    // Prisma schema expects Json for specifications; keep request backward-compatible.
    if (!body.specifications) {
      body.specifications = {};
    }
    if (!body.currency) {
      body.currency = "INR";
    }
    if (body.quantity) body.quantity = Number(body.quantity);
    if (body.year) body.year = Number(body.year);
    if (imagesThumbnail) body.imagesThumbnail = imagesThumbnail;
    if (videoThumbnail) body.videoThumbnail = videoThumbnail;
    const product = await createProductSubmission(req.user!.id, body);
    res
      .status(201)
      .json(new ApiResponse(201, product, "Product submitted for approval"));
  }
);
