"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import { QK } from "../utils/queryKeys";

export interface AdminArticle {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

type UpsertArticlePayload = {
  title: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  coverImageFile?: File;
};

const toFormData = (payload: Partial<UpsertArticlePayload>) => {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.content !== undefined) formData.append("content", payload.content);
  if (payload.coverImage !== undefined) {
    formData.append("coverImage", payload.coverImage);
  }
  if (payload.published !== undefined) {
    formData.append("published", String(payload.published));
  }
  if (payload.coverImageFile) {
    formData.append("coverImageFile", payload.coverImageFile);
  }
  return formData;
};

export const useAdminArticles = () => {
  return useQuery({
    queryKey: QK.articles,
    queryFn: async (): Promise<AdminArticle[]> => {
      const { data } = await api.get("/api/v1/admins/articles");
      return data.data ?? [];
    },
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpsertArticlePayload) => {
      const { data } = await api.post(
        "/api/v1/admins/articles",
        toFormData(payload)
      );
      return data.data as AdminArticle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.articles });
      toast.success("Article created");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create article");
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpsertArticlePayload>;
    }) => {
      const { data } = await api.patch(
        `/api/v1/admins/articles/${id}`,
        toFormData(payload)
      );
      return data.data as AdminArticle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.articles });
      toast.success("Article updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update article");
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/admins/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.articles });
      toast.success("Article deleted");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete article");
    },
  });
};
