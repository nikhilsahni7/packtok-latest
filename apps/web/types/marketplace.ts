export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  quantity: number;
  productType: ProductType;
  machineType?: MachineType;
  imagesThumbnail?: string;
  images: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  pdfUrl?: string;
  specifications: Record<string, unknown>;
  condition: ProductCondition;
  status: ProductStatus;
  additionalInfo?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  category: {
    id: string;
    name: string;
  };
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  };
  submissionStatus?: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  companyName: string;
  address: string;
  message: string;
  additionalInfo?: string;
  status: QuoteStatus;
  userId: string;
  productId: string;
  product?: Product;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Enums
export type ProductType =
  | "MACHINERY"
  | "SPARE_PARTS"
  | "CONSUMABLES"
  | "RAW_MATERIALS";
export type ProductCondition = "NEW" | "USED";
export type ProductStatus = "AVAILABLE" | "OUT_OF_STOCK" | "DRAFT" | "SOLD";
export type SubmissionStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
export type QuoteStatus = "PENDING" | "REVIEWED" | "COMPLETED" | "CANCELLED";
export type MachineType = "MONO_CARTON" | "MASTER_CARTON" | "BOTH" | "OTHER";

// API Response types
export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoriesResponse {
  data: Category[];
}

// Filter and query types
export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string | string[]; // Support multiple categories
  subCategory?: string | string[]; // Support multiple subcategories
  productType?: ProductType | ProductType[]; // Support multiple product types
  machineType?: MachineType | MachineType[]; // Support multiple machine types
  condition?: ProductCondition | ProductCondition[]; // Support multiple conditions
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string;
}

export interface CreateQuotePayload {
  productId: string;
  companyName: string;
  PhoneNo: string;
  Email: string;
  address: string;
  message: string;
  additionalInfo?: string;
}

export interface ProductSubmissionPayload {
  title: string;
  description: string;
  price: number;
  productType: ProductType;
  condition: ProductCondition;
  categoryName: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  specifications?: Record<string, unknown>;
  additionalInfo?: string;
}
