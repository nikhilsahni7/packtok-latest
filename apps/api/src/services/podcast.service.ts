/* eslint-disable @typescript-eslint/no-explicit-any */
import { PodcastStatus, Prisma, ReactionType, prisma } from "@packtok/db";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";
import {
  getSignedPodcastPlaybackUrl,
  uploadPodcastVideoToS3,
} from "../utils/podcastVideoStorage.service";
import {
  uploadThumbnailImageToSupabase,
} from "../utils/storage.service";

// ===== Types =====

type CursorPagination = {
  cursor?: string;
  limit?: number;
};

type PodcastListOptions = CursorPagination & {
  tags?: string[];
  seriesId?: string;
  status?: PodcastStatus;
  search?: string;
};

type CreatePodcastInput = {
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  status?: PodcastStatus;
  releaseDate?: Date;
  seriesId?: string;
  episodeNumber?: number;
  tags?: string[];
};

type VideoUploadData = {
  buffer: Buffer;
  mimetype: string;
};

type UploadTask = () => Promise<void>;

// Upload status constants (matches Prisma enum after generation)
const UPLOAD_STATUS = {
  PENDING: "PENDING",
  UPLOADING: "UPLOADING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

const parsedUploadConcurrency = Number(process.env.PODCAST_UPLOAD_CONCURRENCY);
const MAX_CONCURRENT_PODCAST_UPLOADS =
  Number.isFinite(parsedUploadConcurrency) && parsedUploadConcurrency > 0
    ? Math.floor(parsedUploadConcurrency)
    : 3;
let activePodcastUploads = 0;
const pendingUploadTasks: UploadTask[] = [];

const drainUploadQueue = () => {
  while (
    activePodcastUploads < MAX_CONCURRENT_PODCAST_UPLOADS &&
    pendingUploadTasks.length > 0
  ) {
    const nextTask = pendingUploadTasks.shift();
    if (!nextTask) return;
    activePodcastUploads += 1;
    nextTask()
      .catch(() => {
        // Upload task already persists failure state; no-op here.
      })
      .finally(() => {
        activePodcastUploads = Math.max(0, activePodcastUploads - 1);
        drainUploadQueue();
      });
  }
};

// ===== Series Service =====

export const createSeries = async (data: {
  title: string;
  description?: string;
  coverImage?: string;
}) => {
  return prisma.podcastSeries.create({ data });
};

export const updateSeries = async (
  id: string,
  data: { title?: string; description?: string; coverImage?: string }
) => {
  const series = await prisma.podcastSeries.findUnique({ where: { id } });
  if (!series) throw new ApiError(404, "Series not found");
  return prisma.podcastSeries.update({ where: { id }, data });
};

export const deleteSeries = async (id: string) => {
  const series = await prisma.podcastSeries.findUnique({ where: { id } });
  if (!series) throw new ApiError(404, "Series not found");
  return prisma.podcastSeries.delete({ where: { id } });
};

export const listSeries = async () => {
  return prisma.podcastSeries.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
      _count: { select: { podcasts: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getSeriesWithEpisodes = async (id: string) => {
  const series = await prisma.podcastSeries.findUnique({
    where: { id },
    include: {
      podcasts: {
        where: {
          status: PodcastStatus.PUBLISHED,
          uploadStatus: UPLOAD_STATUS.COMPLETED as any,
        },
        orderBy: { episodeNumber: "asc" },
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          duration: true,
          episodeNumber: true,
          releaseDate: true,
          viewCount: true,
        },
      },
    },
  });
  if (!series) throw new ApiError(404, "Series not found");
  return series;
};

// ===== Background Upload Processing =====

/**
 * Process video upload in background without blocking the request.
 * Uses setImmediate to defer heavy work to next event loop tick.
 * Safe for concurrent uploads - each runs independently.
 */
const processVideoUploadInBackground = (
  podcastId: string,
  videoData: VideoUploadData,
  thumbnailData?: VideoUploadData
) => {
  pendingUploadTasks.push(async () => {
    try {
      logger.info({ podcastId }, "Starting background video upload");

      // Mark as uploading
      await prisma.podcast.update({
        where: { id: podcastId },
        data: { uploadStatus: UPLOAD_STATUS.UPLOADING as any },
      });

      // Upload video and thumbnail in parallel for speed
      const uploadPromises: Promise<string>[] = [
        uploadPodcastVideoToS3(videoData.buffer, videoData.mimetype, "podcasts"),
      ];

      if (thumbnailData) {
        uploadPromises.push(
          uploadThumbnailImageToSupabase(
            thumbnailData.buffer,
            thumbnailData.mimetype,
            "podcast-thumbnails"
          )
        );
      }

      const results = await Promise.all(uploadPromises);
      const videoUrl = results[0];
      const thumbnailUrl = thumbnailData ? results[1] : undefined;

      // Update podcast with URLs and mark as completed
      await prisma.podcast.update({
        where: { id: podcastId },
        data: {
          videoUrl,
          ...(thumbnailUrl && { thumbnailUrl }),
          uploadStatus: UPLOAD_STATUS.COMPLETED as any,
          uploadError: null,
        },
      });

      logger.info({ podcastId, videoUrl }, "Background video upload completed");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      logger.error(
        { podcastId, error: errorMessage },
        "Background video upload failed"
      );

      // Mark as failed with error message
      await prisma.podcast
        .update({
          where: { id: podcastId },
          data: {
            uploadStatus: UPLOAD_STATUS.FAILED as any,
            uploadError: errorMessage,
          },
        })
        .catch(() => {
          // Ignore errors in error handler
        });
    }
  });
  setImmediate(drainUploadQueue);
};

// ===== Podcast Service =====

export const createPodcast = async (data: CreatePodcastInput) => {
  return prisma.podcast.create({
    data: {
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration,
      status: data.status ?? PodcastStatus.DRAFT,
      releaseDate: data.releaseDate,
      seriesId: data.seriesId,
      episodeNumber: data.episodeNumber,
      tags: data.tags ?? [],
      uploadStatus: data.videoUrl
        ? (UPLOAD_STATUS.COMPLETED as any)
        : (UPLOAD_STATUS.PENDING as any),
    },
  });
};

/**
 * Creates podcast and uploads video in background.
 * Returns immediately with podcast record, video uploads async.
 */
export const createPodcastWithBackgroundUpload = async (
  data: CreatePodcastInput,
  videoData?: VideoUploadData,
  thumbnailData?: VideoUploadData
): Promise<{ podcast: any; uploading: boolean }> => {
  // If no video data and no URL, error
  if (!videoData && !data.videoUrl) {
    throw new ApiError(400, "Video is required");
  }

  // If video URL provided directly, create immediately (no background upload)
  if (data.videoUrl) {
    const podcast = await createPodcast(data);
    return { podcast, uploading: false };
  }

  // Upload thumbnail synchronously if provided (small file, fast)
  let thumbnailUrl: string | undefined;
  if (thumbnailData) {
    thumbnailUrl = await uploadThumbnailImageToSupabase(
      thumbnailData.buffer,
      thumbnailData.mimetype,
      "podcast-thumbnails"
    );
  }

  // Create podcast record first (PENDING status)
  const podcast = await prisma.podcast.create({
    data: {
      title: data.title,
      description: data.description,
      thumbnailUrl,
      duration: data.duration,
      status: data.status ?? PodcastStatus.DRAFT,
      releaseDate: data.releaseDate,
      seriesId: data.seriesId,
      episodeNumber: data.episodeNumber,
      tags: data.tags ?? [],
      uploadStatus: UPLOAD_STATUS.PENDING as any,
    },
  });

  // Start background upload (non-blocking)
  if (videoData) {
    processVideoUploadInBackground(podcast.id, videoData);
  }

  return { podcast, uploading: true };
};

export const updatePodcast = async (
  id: string,
  data: Prisma.PodcastUpdateInput
) => {
  const podcast = await prisma.podcast.findUnique({ where: { id } });
  if (!podcast) throw new ApiError(404, "Podcast not found");
  return prisma.podcast.update({ where: { id }, data });
};

/**
 * Updates podcast and uploads new video in background if provided.
 */
export const updatePodcastWithBackgroundUpload = async (
  id: string,
  data: Prisma.PodcastUpdateInput,
  videoData?: VideoUploadData,
  thumbnailData?: VideoUploadData
): Promise<{ podcast: any; uploading: boolean }> => {
  const podcast = await prisma.podcast.findUnique({ where: { id } });
  if (!podcast) throw new ApiError(404, "Podcast not found");

  // Handle thumbnail synchronously (small file)
  if (thumbnailData) {
    const thumbnailUrl = await uploadThumbnailImageToSupabase(
      thumbnailData.buffer,
      thumbnailData.mimetype,
      "podcast-thumbnails"
    );
    data.thumbnailUrl = thumbnailUrl;
  }

  // If new video, mark as pending and upload in background
  if (videoData) {
    const updated = await prisma.podcast.update({
      where: { id },
      data: {
        ...data,
        uploadStatus: UPLOAD_STATUS.PENDING as any,
        uploadError: null,
      },
    });

    processVideoUploadInBackground(id, videoData);
    return { podcast: updated, uploading: true };
  }

  // No video change, just update other fields
  const updated = await prisma.podcast.update({ where: { id }, data });
  return { podcast: updated, uploading: false };
};

export const deletePodcast = async (id: string) => {
  const podcast = await prisma.podcast.findUnique({ where: { id } });
  if (!podcast) throw new ApiError(404, "Podcast not found");
  return prisma.podcast.delete({ where: { id } });
};

export const getPodcastByIdForAdmin = async (id: string) => {
  const podcast = await prisma.podcast.findUnique({
    where: { id },
    include: {
      series: { select: { id: true, title: true } },
      _count: { select: { reactions: true, comments: true } },
    },
  });
  if (!podcast) throw new ApiError(404, "Podcast not found");

  if (!podcast.videoUrl) return podcast;

  return {
    ...podcast,
    videoUrl: await getSignedPodcastPlaybackUrl(podcast.videoUrl),
  };
};

export const listPodcastsForAdmin = async () => {
  return prisma.podcast.findMany({
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      videoUrl: true,
      status: true,
      uploadStatus: true,
      uploadError: true,
      releaseDate: true,
      viewCount: true,
      createdAt: true,
      series: { select: { id: true, title: true } },
      _count: { select: { reactions: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Retry a failed upload
 */
export const retryFailedUpload = async (
  id: string,
  videoData: VideoUploadData,
  thumbnailData?: VideoUploadData
) => {
  const podcast = await prisma.podcast.findUnique({ where: { id } });
  if (!podcast) throw new ApiError(404, "Podcast not found");

  if ((podcast as any).uploadStatus !== UPLOAD_STATUS.FAILED) {
    throw new ApiError(400, "Only failed uploads can be retried");
  }

  await prisma.podcast.update({
    where: { id },
    data: {
      uploadStatus: UPLOAD_STATUS.PENDING as any,
      uploadError: null,
    },
  });

  processVideoUploadInBackground(id, videoData, thumbnailData);

  return prisma.podcast.findUnique({ where: { id } });
};

// ===== Public Podcast Service =====
const publicPodcastSelect = {
  id: true,
  title: true,
  description: true,
  thumbnailUrl: true,
  duration: true,
  releaseDate: true,
  tags: true,
  viewCount: true,
  series: { select: { id: true, title: true } },
} satisfies Prisma.PodcastSelect;

export const listPublicPodcasts = async (options: PodcastListOptions) => {
  const limit = Math.min(options.limit ?? 20, 50);
  const where: Prisma.PodcastWhereInput = {
    status: PodcastStatus.PUBLISHED,
    uploadStatus: UPLOAD_STATUS.COMPLETED as any,
    releaseDate: { lte: new Date() },
    NOT: { videoUrl: null },
    ...(options.tags?.length && { tags: { hasSome: options.tags } }),
    ...(options.seriesId && { seriesId: options.seriesId }),
    ...(options.search && {
      OR: [
        { title: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ],
    }),
  };

  const podcasts = await prisma.podcast.findMany({
    where,
    take: limit + 1,
    ...(options.cursor && { cursor: { id: options.cursor }, skip: 1 }),
    orderBy: { releaseDate: "desc" },
    select: {
      ...publicPodcastSelect,
      reactions: { select: { type: true } },
      _count: { select: { comments: true } },
    },
  });

  const hasMore = podcasts.length > limit;
  const items = hasMore ? podcasts.slice(0, -1) : podcasts;

  // Transform to include counts
  const transformedItems = items.map((p) => {
    const likeCount = p.reactions.filter(
      (r) => r.type === ReactionType.LIKE
    ).length;
    const dislikeCount = p.reactions.filter(
      (r) => r.type === ReactionType.DISLIKE
    ).length;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reactions, _count, ...rest } = p;
    return { ...rest, likeCount, dislikeCount, commentCount: _count.comments };
  });

  return {
    items: transformedItems,
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
    hasMore,
  };
};

export const getPublicPodcastById = async (id: string, userId?: string) => {
  const podcast = await prisma.podcast.findFirst({
    where: {
      id,
      status: PodcastStatus.PUBLISHED,
      uploadStatus: UPLOAD_STATUS.COMPLETED as any,
      releaseDate: { lte: new Date() },
      NOT: { videoUrl: null },
    },
    include: {
      series: {
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              podcasts: {
                where: {
                  status: PodcastStatus.PUBLISHED,
                  uploadStatus: UPLOAD_STATUS.COMPLETED as any,
                },
              },
            },
          },
        },
      },
      reactions: { select: { type: true, userId: true } },
      _count: { select: { comments: true } },
    },
  });

  if (!podcast) throw new ApiError(404, "Podcast not found");

  // Increment view count (fire and forget)
  prisma.podcast
    .update({ where: { id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {
      // Ignore view count errors
    });

  const likeCount = podcast.reactions.filter(
    (r) => r.type === ReactionType.LIKE
  ).length;
  const dislikeCount = podcast.reactions.filter(
    (r) => r.type === ReactionType.DISLIKE
  ).length;
  const userReaction = userId
    ? (podcast.reactions.find((r) => r.userId === userId)?.type ?? null)
    : null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reactions, _count, series, ...rest } = podcast;
  const signedVideoUrl = rest.videoUrl
    ? await getSignedPodcastPlaybackUrl(rest.videoUrl)
    : null;

  return {
    ...rest,
    videoUrl: signedVideoUrl,
    likeCount,
    dislikeCount,
    commentCount: _count.comments,
    userReaction,
    series: series
      ? {
          id: series.id,
          title: series.title,
          episodeNumber: rest.episodeNumber,
          totalEpisodes: series._count.podcasts,
        }
      : null,
  };
};

// ===== Reactions Service =====

export const toggleReaction = async (
  podcastId: string,
  userId: string,
  type: ReactionType
) => {
  return prisma.$transaction(async (tx) => {
    // Verify podcast exists and is published
    const podcast = await tx.podcast.findFirst({
      where: {
        id: podcastId,
        status: PodcastStatus.PUBLISHED,
        uploadStatus: UPLOAD_STATUS.COMPLETED as any,
      },
    });
    if (!podcast) throw new ApiError(404, "Podcast not found");

    const existing = await tx.podcastReaction.findUnique({
      where: { podcastId_userId: { podcastId, userId } },
    });

    // Same reaction type = remove
    if (existing?.type === type) {
      await tx.podcastReaction.delete({ where: { id: existing.id } });
      return { action: "removed" as const, type };
    }

    // Create or update
    await tx.podcastReaction.upsert({
      where: { podcastId_userId: { podcastId, userId } },
      create: { podcastId, userId, type },
      update: { type },
    });

    return {
      action: existing ? ("changed" as const) : ("added" as const),
      type,
    };
  });
};

// ===== Comments Service =====

export const addComment = async (
  podcastId: string,
  userId: string,
  content: string,
  parentId?: string
) => {
  return prisma.$transaction(async (tx) => {
    // Verify podcast exists
    const podcast = await tx.podcast.findFirst({
      where: {
        id: podcastId,
        status: PodcastStatus.PUBLISHED,
        uploadStatus: UPLOAD_STATUS.COMPLETED as any,
      },
    });
    if (!podcast) throw new ApiError(404, "Podcast not found");

    // If replying, verify parent exists and belongs to same podcast
    if (parentId) {
      const parent = await tx.podcastComment.findUnique({
        where: { id: parentId },
      });
      if (parent?.podcastId !== podcastId) {
        throw new ApiError(400, "Invalid parent comment");
      }
    }

    return tx.podcastComment.create({
      data: { podcastId, userId, content, parentId },
      include: {
        user: { select: { id: true, name: true, profile_image: true } },
      },
    });
  });
};

export const getComments = async (
  podcastId: string,
  options: CursorPagination
) => {
  const limit = Math.min(options.limit ?? 20, 50);

  const comments = await prisma.podcastComment.findMany({
    where: { podcastId, parentId: null },
    take: limit + 1,
    ...(options.cursor && { cursor: { id: options.cursor }, skip: 1 }),
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, profile_image: true } },
      replies: {
        take: 3,
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, profile_image: true } },
        },
      },
      _count: { select: { replies: true } },
    },
  });

  const hasMore = comments.length > limit;
  const items = hasMore ? comments.slice(0, -1) : comments;

  return {
    items: items.map((c) => ({
      ...c,
      replyCount: c._count.replies,
      _count: undefined,
    })),
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
    hasMore,
  };
};

export const getReplies = async (
  commentId: string,
  options: CursorPagination
) => {
  const limit = Math.min(options.limit ?? 20, 50);

  const replies = await prisma.podcastComment.findMany({
    where: { parentId: commentId },
    take: limit + 1,
    ...(options.cursor && { cursor: { id: options.cursor }, skip: 1 }),
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, profile_image: true } },
    },
  });

  const hasMore = replies.length > limit;
  const items = hasMore ? replies.slice(0, -1) : replies;

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
    hasMore,
  };
};

export const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prisma.podcastComment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.userId !== userId) throw new ApiError(403, "Not authorized");
  return prisma.podcastComment.delete({ where: { id: commentId } });
};
