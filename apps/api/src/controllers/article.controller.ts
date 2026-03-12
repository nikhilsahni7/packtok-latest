import { Request, Response } from "express";
import {
  getPublishedArticleById,
  listPublishedArticles,
} from "../services/article.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const listPublicArticles = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const articles = await listPublishedArticles(limit);
    res
      .status(200)
      .json(new ApiResponse(200, articles, "Articles fetched successfully"));
  }
);

export const getPublicArticle = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const article = await getPublishedArticleById(id);
    res
      .status(200)
      .json(new ApiResponse(200, article, "Article fetched successfully"));
  }
);
