import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  CursorPage,
  PodcastComment,
  PodcastDetail,
  PodcastListItem,
  PodcastReactionType,
} from "@/types/podcast";
import { Alert } from "react-native";

export const QK = {
  podcasts: ["podcasts"],
  podcast: ["podcast"],
  podcastComments: ["podcastComments"],
};

type PodcastListQuery = {
  limit?: number;
  cursor?: string;
  tags?: string[];
  seriesId?: string;
  search?: string;
};

type ApiEnvelope<T> = {
  data: T;
  message: string;
  statusCode: number;
};

type ReactionResponse = {
  action: "added" | "changed" | "removed";
  type: PodcastReactionType;
};

const parseErrorMessage = (error: unknown, fallback: string) => {
  const message =
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? fallback;
  return message;
};

export const usePodcasts = (params: PodcastListQuery = {}) => {
  return useQuery({
    queryKey: [...QK.podcasts, params],
    queryFn: async (): Promise<CursorPage<PodcastListItem>> => {
      const { data } = await api.get<ApiEnvelope<CursorPage<PodcastListItem>>>(
        "/api/v1/podcasts",
        { params }
      );
      return data.data;
    },
  });
};

export const usePodcast = (id: string) => {
  return useQuery({
    queryKey: [...QK.podcast, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<PodcastDetail> => {
      const { data } = await api.get<ApiEnvelope<PodcastDetail>>(
        `/api/v1/podcasts/${id}`
      );
      return data.data;
    },
  });
};

export const usePodcastComments = (id: string, limit = 20) => {
  return useQuery({
    queryKey: [...QK.podcastComments, id, limit],
    enabled: Boolean(id),
    queryFn: async (): Promise<CursorPage<PodcastComment>> => {
      const { data } = await api.get<ApiEnvelope<CursorPage<PodcastComment>>>(
        `/api/v1/podcasts/${id}/comments`,
        { params: { limit } }
      );
      return data.data;
    },
  });
};

export const useReactToPodcast = (podcastId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (type: PodcastReactionType) => {
      const { data } = await api.post<ApiEnvelope<ReactionResponse>>(
        `/api/v1/podcasts/${podcastId}/react`,
        { type }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.podcast });
      queryClient.invalidateQueries({ queryKey: QK.podcasts });
    },
    onError: (error) => {
      Alert.alert("Error", parseErrorMessage(error, "Failed to update reaction"));
    },
  });
};

export const useAddPodcastComment = (podcastId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      parentId,
    }: {
      content: string;
      parentId?: string;
    }) => {
      const { data } = await api.post<ApiEnvelope<PodcastComment>>(
        `/api/v1/podcasts/${podcastId}/comments`,
        { content, parentId }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QK.podcast, podcastId] });
      queryClient.invalidateQueries({
        queryKey: [...QK.podcastComments, podcastId],
      });
      queryClient.invalidateQueries({ queryKey: QK.podcasts });
    },
    onError: (error) => {
      Alert.alert("Error", parseErrorMessage(error, "Failed to add comment"));
    },
  });
};
