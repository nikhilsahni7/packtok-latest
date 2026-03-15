import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface PublicArticle {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
  };
}

export const useArticles = (limit?: number) => {
  return useQuery({
    queryKey: ["articles", limit ?? "all"],
    queryFn: async (): Promise<PublicArticle[]> => {
      const { data } = await api.get("/api/v1/articles", {
        params: limit ? { limit } : undefined,
      });
      return data.data ?? [];
    },
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ["article", id],
    enabled: Boolean(id),
    queryFn: async (): Promise<PublicArticle> => {
      const { data } = await api.get(`/api/v1/articles/${id}`);
      return data.data;
    },
  });
};
