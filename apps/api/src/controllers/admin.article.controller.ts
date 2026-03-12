import { Request, Response } from "express";
import {
  createArticleForAdmin,
  deleteArticleForAdmin,
  getArticleByIdForAdmin,
  listArticlesForAdmin,
  updateArticleForAdmin,
} from "../services/article.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadThumbnailImageToSupabase } from "../utils/storage.service";

const parsePublished = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
};

export const adminListArticles = asyncHandler(
  async (_req: Request, res: Response) => {
    const articles = await listArticlesForAdmin();
    res
      .status(200)
      .json(new ApiResponse(200, articles, "Articles fetched successfully"));
  }
);

export const adminGetArticle = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const article = await getArticleByIdForAdmin(id);
    res
      .status(200)
      .json(new ApiResponse(200, article, "Article fetched successfully"));
  }
);

export const adminCreateArticle = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }

    const { title, content, coverImage, published } = req.body;
    let resolvedCoverImage = coverImage;
    if (req.file) {
      resolvedCoverImage = await uploadThumbnailImageToSupabase(
        req.file.buffer,
        req.file.mimetype,
        "articles"
      );
    }
    const article = await createArticleForAdmin(req.user.id, {
      title,
      content,
      coverImage: resolvedCoverImage,
      published: parsePublished(published),
    });

    res
      .status(201)
      .json(new ApiResponse(201, article, "Article created successfully"));
  }
);

export const adminUpdateArticle = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, coverImage, published } = req.body;
    let resolvedCoverImage = coverImage;
    if (req.file) {
      resolvedCoverImage = await uploadThumbnailImageToSupabase(
        req.file.buffer,
        req.file.mimetype,
        "articles"
      );
    }
    const article = await updateArticleForAdmin(id, {
      title,
      content,
      coverImage: resolvedCoverImage,
      published: parsePublished(published),
    });
    res
      .status(200)
      .json(new ApiResponse(200, article, "Article updated successfully"));
  }
);

export const adminDeleteArticle = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteArticleForAdmin(id);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Article deleted successfully"));
  }
);
