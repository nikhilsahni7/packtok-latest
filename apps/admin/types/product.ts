// Types based on Prisma schema
export type ProductType =
  | "MACHINERY"
  | "SPARE_PARTS"
  | "CONSUMABLES"
  | "RAW_MATERIALS";
export type ProductCondition = "NEW" | "USED";
export type MarketplaceProductStatus =
  | "AVAILABLE"
  | "OUT_OF_STOCK"
  | "DRAFT"
  | "SOLD";
export type UserSubmissionStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
export type MachineType = "MONO_CARTON" | "MASTER_CARTON" | "BOTH" | "OTHER";
export type QuoteStatus = "PENDING" | "REVIEWED" | "COMPLETED" | "CANCELLED";

export type Specification = Record<string, string | number | boolean>;

export interface MarketplaceProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  price: number; // Decimal in Prisma, but we'll use number in TS
  quantity: number;
  productType: ProductType;
  machineType?: MachineType;
  images: string[]; // Array of image URLs
  imagesThumbnail?: string; // Main product image
  videoUrl?: string;
  videoThumbnail?: string; // Note: schema uses videoThumbnail not videoThumbnailUrl
  pdfUrl?: string;
  specifications: Specification; // JSON field
  condition: ProductCondition;
  status: MarketplaceProductStatus;
  additionalInfo?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  categoryId: string;
  category?: Category;
  subCategory?: string;
  createdById: string;
  createdByUser?: User;
  submissionStatus?: UserSubmissionStatus;
  quoteRequests?: QuoteRequest[];
}

// For backwards compatibility
export interface Product extends MarketplaceProduct {}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone_number?: string;
  role: "NORMAL_USER" | "VENDOR" | "ADMIN" | "SUPER_ADMIN";
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
  createdAt: string;
  products?: MarketplaceProduct[];
}

export interface QuoteRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  message: string;
  additionalInfo?: string;
  status: QuoteStatus;
  userId: string;
  user?: User;
  productId: string;
  product?: MarketplaceProduct;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  quantity: number;
  productType: ProductType;
  machineType?: MachineType;
  condition: ProductCondition;
  manufacturer?: string;
  model?: string;
  year?: number;
  categoryName: string; // API uses categoryName, not categoryId
  specifications?: string; // JSON string
  additionalInfo?: string;
}
