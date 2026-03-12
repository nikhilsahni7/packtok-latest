"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import { QK } from "../utils/queryKeys";

type ApiEnvelope<T> = {
  data: T;
  message: string;
  statusCode: number;
};

export type UploadStatus = "PENDING" | "UPLOADING" | "COMPLETED" | "FAILED";
export type PodcastStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface AdminPodcast {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  status: PodcastStatus;
  uploadStatus: UploadStatus;
  uploadError: string | null;
  releaseDate: string | null;
  viewCount: number;
  createdAt: string;
  series: { id: string; title: string } | null;
  _count: { reactions: number; comments: number };
}

export interface AdminPodcastDetail extends AdminPodcast {
  description: string;
  duration: number | null;
  episodeNumber: number | null;
  tags: string[];
}

export interface PodcastSeries {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  _count?: { podcasts: number };
}

export interface UpsertPodcastPayload {
  title: string;
  description: string;
  duration?: number;
  status?: PodcastStatus;
  releaseDate?: string;
  seriesId?: string;
  episodeNumber?: number;
  tags?: string;
  video?: File | null;
  thumbnail?: File | null;
}

type CreatePodcastArgs = {
  payload: UpsertPodcastPayload;
  onUploadProgress?: (percent: number) => void;
};

type UpdatePodcastArgs = {
  id: string;
  payload: Partial<UpsertPodcastPayload>;
  onUploadProgress?: (percent: number) => void;
};

const toPodcastFormData = (payload: Partial<UpsertPodcastPayload>) => {
  const fd = new FormData();
  if (payload.title !== undefined) fd.append("title", payload.title);
  if (payload.description !== undefined) fd.append("description", payload.description);
  if (payload.duration !== undefined) fd.append("duration", String(payload.duration));
  if (payload.status !== undefined) fd.append("status", payload.status);
  if (payload.releaseDate !== undefined) fd.append("releaseDate", payload.releaseDate);
  if (payload.seriesId !== undefined) fd.append("seriesId", payload.seriesId);
  if (payload.episodeNumber !== undefined) {
    fd.append("episodeNumber", String(payload.episodeNumber));
  }
  if (payload.tags !== undefined) fd.append("tags", payload.tags);
  if (payload.video) fd.append("video", payload.video);
  if (payload.thumbnail) fd.append("thumbnail", payload.thumbnail);
  return fd;
};

const parseErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

export const useAdminPodcasts = () => {
  return useQuery({
    queryKey: QK.podcasts,
    queryFn: async (): Promise<AdminPodcast[]> => {
      const { data } = await api.get<ApiEnvelope<AdminPodcast[]>>(
        "/api/v1/admins/podcasts"
      );
      return data.data ?? [];
    },
    refetchInterval: 10000,
  });
};

export const usePodcastSeries = () => {
  return useQuery({
    queryKey: QK.podcastSeries,
    queryFn: async (): Promise<PodcastSeries[]> => {
      const { data } = await api.get<ApiEnvelope<PodcastSeries[]>>(
        "/api/v1/admins/podcasts/series"
      );
      return data.data ?? [];
    },
  });
};

export const useAdminPodcast = (id: string | null) => {
  return useQuery({
    queryKey: [...QK.podcasts, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<AdminPodcastDetail> => {
      const { data } = await api.get<ApiEnvelope<AdminPodcastDetail>>(
        `/api/v1/admins/podcasts/${id}`
      );
      return data.data;
    },
  });
};

export const useCreatePodcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, onUploadProgress }: CreatePodcastArgs) => {
      const { data } = await api.post<ApiEnvelope<AdminPodcast>>(
        "/api/v1/admins/podcasts",
        toPodcastFormData(payload),
        {
          onUploadProgress: (event) => {
            if (!event.total) return;
            const percent = Math.min(
              100,
              Math.round((event.loaded * 100) / event.total)
            );
            onUploadProgress?.(percent);
          },
        }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.podcasts });
      toast.success("Podcast created");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, "Failed to create podcast"));
    },
  });
};

export const useUpdatePodcastStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: PodcastStatus;
    }) => {
      const { data } = await api.patch<ApiEnvelope<AdminPodcast>>(
        `/api/v1/admins/podcasts/${id}`,
        toPodcastFormData({ status })
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.podcasts });
      toast.success("Podcast status updated");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, "Failed to update podcast status"));
    },
  });
};

export const useUpdatePodcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload, onUploadProgress }: UpdatePodcastArgs) => {
      const { data } = await api.patch<ApiEnvelope<AdminPodcast>>(
        `/api/v1/admins/podcasts/${id}`,
        toPodcastFormData(payload),
        {
          onUploadProgress: (event) => {
            if (!event.total) return;
            const percent = Math.min(
              100,
              Math.round((event.loaded * 100) / event.total)
            );
            onUploadProgress?.(percent);
          },
        }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.podcasts });
      toast.success("Podcast updated");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, "Failed to update podcast"));
    },
  });
};

export const useDeletePodcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/admins/podcasts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.podcasts });
      toast.success("Podcast deleted");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, "Failed to delete podcast"));
    },
  });
};

export const useRetryPodcastUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, video }: { id: string; video: File }) => {
      const fd = new FormData();
      fd.append("video", video);
      const { data } = await api.post<ApiEnvelope<AdminPodcast>>(
        `/api/v1/admins/podcasts/${id}/retry-upload`,
        fd
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.podcasts });
      toast.success("Retry started");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, "Retry failed"));
    },
  });
};

export const useCreateSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      coverImage,
    }: {
      title: string;
      description?: string;
      coverImage?: File | null;
    }) => {
      const fd = new FormData();
      fd.append("title", title);
      if (description) fd.append("description", description);
      if (coverImage) fd.append("coverImage", coverImage);
      const { data } = await api.post<ApiEnvelope<PodcastSeries>>(
        "/api/v1/admins/podcasts/series",
        fd
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.podcastSeries });
      toast.success("Series created");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, "Failed to create series"));
    },
  });
};
