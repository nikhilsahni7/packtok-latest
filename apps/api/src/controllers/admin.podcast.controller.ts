import { PodcastStatus } from "@packtok/db";
import { Request, Response } from "express";
import {
  createPodcastWithBackgroundUpload,
  createSeries,
  deletePodcast,
  deleteSeries,
  getPodcastByIdForAdmin,
  listPodcastsForAdmin,
  listSeries,
  retryFailedUpload,
  updatePodcastWithBackgroundUpload,
  updateSeries,
} from "../services/podcast.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadThumbnailImageToSupabase } from "../utils/storage.service";

// ===== Helper =====

interface MulterFile {
  buffer: Buffer;
  mimetype: string;
}

type MulterFiles = {
  [fieldname: string]: MulterFile[];
};

const extractVideoData = (files: MulterFiles | undefined) => {
  const videoFile = files?.video?.[0];
  const thumbnailFile = files?.thumbnail?.[0];

  return {
    videoData: videoFile
      ? { buffer: videoFile.buffer, mimetype: videoFile.mimetype }
      : undefined,
    thumbnailData: thumbnailFile
      ? { buffer: thumbnailFile.buffer, mimetype: thumbnailFile.mimetype }
      : undefined,
  };
};

const parsePodcastBody = (body: Record<string, unknown>) => {
  const data: Record<string, unknown> = { ...body };

  // Parse tags from string or array
  if (typeof data.tags === "string") {
    data.tags = (data.tags as string)
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  }

  // Parse numbers
  if (data.duration) data.duration = Number(data.duration);
  if (data.episodeNumber) data.episodeNumber = Number(data.episodeNumber);

  // Parse date
  if (data.releaseDate) data.releaseDate = new Date(data.releaseDate as string);

  // Ensure status is valid
  if (data.status && !Object.values(PodcastStatus).includes(data.status)) {
    delete data.status;
  }

  return data;
};

// ===== Podcast Endpoints =====

export const listPodcasts = asyncHandler(
  async (_req: Request, res: Response) => {
    const podcasts = await listPodcastsForAdmin();
    res.json(new ApiResponse(200, podcasts, "Podcasts fetched"));
  }
);

export const getPodcast = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const podcast = await getPodcastByIdForAdmin(id);
  res.json(new ApiResponse(200, podcast, "Podcast fetched"));
});

export const createPodcastHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { videoData, thumbnailData } = extractVideoData(
      req.files as MulterFiles
    );
    const data = parsePodcastBody(req.body);

    // Background upload: creates record immediately, uploads video async
    const { podcast, uploading } = await createPodcastWithBackgroundUpload(
      data as Parameters<typeof createPodcastWithBackgroundUpload>[0],
      videoData,
      thumbnailData
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { ...podcast, uploading },
          uploading
            ? "Podcast created. Video is uploading in background."
            : "Podcast created"
        )
      );
  }
);

export const updatePodcastHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { videoData, thumbnailData } = extractVideoData(
      req.files as MulterFiles
    );
    const data = parsePodcastBody(req.body);

    // Background upload for video, sync for thumbnail-only
    const { podcast, uploading } = await updatePodcastWithBackgroundUpload(
      id,
      data,
      videoData,
      thumbnailData
    );

    res.json(
      new ApiResponse(
        200,
        { ...podcast, uploading },
        uploading
          ? "Podcast updated. Video is uploading in background."
          : "Podcast updated"
      )
    );
  }
);

export const deletePodcastHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deletePodcast(id);
    res.json(new ApiResponse(200, null, "Podcast deleted"));
  }
);

export const retryUploadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { videoData, thumbnailData } = extractVideoData(
      req.files as MulterFiles
    );

    if (!videoData) {
      res
        .status(400)
        .json(new ApiResponse(400, null, "Video file is required"));
      return;
    }

    const podcast = await retryFailedUpload(id, videoData, thumbnailData);
    res.json(
      new ApiResponse(
        200,
        podcast,
        "Upload retry started. Processing in background."
      )
    );
  }
);

// ===== Series Endpoints =====

export const listSeriesHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const series = await listSeries();
    res.json(new ApiResponse(200, series, "Series fetched"));
  }
);

export const createSeriesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description } = req.body;

    if (!title?.trim()) {
      res.status(400).json(new ApiResponse(400, null, "Title is required"));
      return;
    }

    let coverImage: string | undefined;
    if (req.file) {
      coverImage = await uploadThumbnailImageToSupabase(
        req.file.buffer,
        req.file.mimetype,
        "series-covers"
      );
    }

    const series = await createSeries({
      title: title.trim(),
      description,
      coverImage,
    });
    res.status(201).json(new ApiResponse(201, series, "Series created"));
  }
);

export const updateSeriesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    let coverImage: string | undefined;
    if (req.file) {
      coverImage = await uploadThumbnailImageToSupabase(
        req.file.buffer,
        req.file.mimetype,
        "series-covers"
      );
    }

    const data: { title?: string; description?: string; coverImage?: string } =
      {};
    if (title?.trim()) data.title = title.trim();
    if (description !== undefined) data.description = description;
    if (coverImage) data.coverImage = coverImage;

    const series = await updateSeries(id, data);
    res.json(new ApiResponse(200, series, "Series updated"));
  }
);

export const deleteSeriesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteSeries(id);
    res.json(new ApiResponse(200, null, "Series deleted"));
  }
);
