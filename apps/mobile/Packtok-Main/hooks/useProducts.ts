// hooks/useProducts.ts
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface ProductFilters {
  categoryId?: string | string[];
  condition?: string | string[];
  machineType?: string | string[];
  productType?: string | string[];
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price?: number;
  quantity?: number;
  condition: string;
  machineType?: string;
  productType: string;
  status: string;
  submissionStatus?: string;
  images: string[];
  videoUrl?: string;
  pdfUrl?: string;
  imagesThumbnail?: string;
  videoThumbnail?: string;
  specifications?: any;
  manufacturer?: string;
  model?: string;
  year?: number;
  additionalInfo?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  subCategory?: string;
  // Cart & display settings
  cartEnabled?: boolean;
  currency?: string;
  displayPrice?: boolean;
  // FAQs
  faqs?: { question: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSubmissionHistoryItem {
  id: string;
  title: string;
  productType: string;
  status: string;
  submissionStatus: string;
  imagesThumbnail?: string | null;
  price?: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useProducts = (filters: ProductFilters) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.categoryId) {
        if (Array.isArray(filters.categoryId)) {
          params.append("categoryId", filters.categoryId.join(","));
        } else {
          params.append("categoryId", filters.categoryId);
        }
      }

      if (filters.condition) {
        if (Array.isArray(filters.condition)) {
          params.append("condition", filters.condition.join(","));
        } else {
          params.append("condition", filters.condition);
        }
      }

      if (filters.machineType) {
        if (Array.isArray(filters.machineType)) {
          params.append("machineType", filters.machineType.join(","));
        } else {
          params.append("machineType", filters.machineType);
        }
      }

      if (filters.productType) {
        if (Array.isArray(filters.productType)) {
          params.append("productType", filters.productType.join(","));
        } else {
          params.append("productType", filters.productType);
        }
      }

      if (filters.priceMin !== undefined) {
        params.append("priceMin", filters.priceMin.toString());
      }

      if (filters.priceMax !== undefined) {
        params.append("priceMax", filters.priceMax.toString());
      }

      if (filters.searchTerm) {
        params.append("searchTerm", filters.searchTerm);
      }

      if (filters.page) {
        params.append("page", filters.page.toString());
      }

      if (filters.limit) {
        params.append("limit", filters.limit.toString());
      }

      const response = await api.get(`/api/v1/products?${params.toString()}`);
      const data = response.data.data;
      // Transform backend response to match our interface
      return {
        products: data.items || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: Math.ceil((data.total || 0) / (data.limit || 10)),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProduct = (productId: string) => {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/products/${productId}`);
      return response.data.data;
    },
    enabled: !!productId,
    staleTime: 0, // Disable caching so cartEnabled changes reflect immediately
  });
};

export const useMyProductSubmissions = () => {
  return useQuery<ProductSubmissionHistoryItem[]>({
    queryKey: ["my-product-submissions"],
    queryFn: async () => {
      const response = await api.get("/api/v1/products/my-submissions");
      return response.data.data ?? [];
    },
    staleTime: 1000 * 30,
  });
};
