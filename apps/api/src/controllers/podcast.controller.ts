import { ReactionType } from "@packtok/db";
import { Request, Response } from "express";
import {
  addComment,
  deleteComment,
  getComments,
  getPublicPodcastById,
  getReplies,
  getSeriesWithEpisodes,
  listPublicPodcasts,
  listSeries,
  toggleReaction,
} from "../services/podcast.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// ===== Podcast Endpoints =====

export const listPodcasts = asyncHandler(async (req: Request, res: Response) => {
  const { cursor, limit, tags, seriesId, search } = req.query;

  const parsedTags = tags
    ? Array.isArray(tags)
      ? (tags as string[])
      : (tags as string).split(",")
    : undefined;

  const result = await listPublicPodcasts({
    cursor: cursor as string,
    limit: limit ? Number(limit) : undefined,
    tags: parsedTags,
    seriesId: seriesId as string,
    search: search as string,
  });

  res.json(new ApiResponse(200, result, "Podcasts fetched"));
});

export const getPodcast = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const podcast = await getPublicPodcastById(id, userId);
  res.json(new ApiResponse(200, podcast, "Podcast fetched"));
});

export const reactToPodcast = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!type || !["LIKE", "DISLIKE"].includes(type)) {
    res.status(400).json(new ApiResponse(400, null, "Invalid reaction type"));
    return;
  }

  const result = await toggleReaction(id, req.user!.id, type as ReactionType);
  res.json(new ApiResponse(200, result, "Reaction updated"));
});

// ===== Comment Endpoints =====

export const getCommentsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cursor, limit } = req.query;

  const result = await getComments(id, {
    cursor: cursor as string,
    limit: limit ? Number(limit) : undefined,
  });

  res.json(new ApiResponse(200, result, "Comments fetched"));
});

export const addCommentHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, parentId } = req.body;

  if (!content?.trim()) {
    res.status(400).json(new ApiResponse(400, null, "Content is required"));
    return;
  }

  const comment = await addComment(id, req.user!.id, content.trim(), parentId);
  res.status(201).json(new ApiResponse(201, comment, "Comment added"));
});

export const getRepliesHandler = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { cursor, limit } = req.query;

  const result = await getReplies(commentId, {
    cursor: cursor as string,
    limit: limit ? Number(limit) : undefined,
  });

  res.json(new ApiResponse(200, result, "Replies fetched"));
});

export const deleteCommentHandler = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  await deleteComment(commentId, req.user!.id);
  res.json(new ApiResponse(200, null, "Comment deleted"));
});

// ===== Series Endpoints =====

export const listSeriesHandler = asyncHandler(async (_req: Request, res: Response) => {
  const series = await listSeries();
  res.json(new ApiResponse(200, series, "Series fetched"));
});

export const getSeriesHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const series = await getSeriesWithEpisodes(id);
  res.json(new ApiResponse(200, series, "Series fetched"));
});


