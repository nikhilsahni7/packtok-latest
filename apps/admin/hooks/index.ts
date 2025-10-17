// Auth hooks
export { useCurrentUser } from "./useCurrentUser";
export { useLogin } from "./useLogin";

// Marketplace hooks
export {
  useCreateProduct,
  useDeleteProduct,
  useGetProduct,
  useProducts,
  useUpdateProduct,
  useUpdateProductStatus,
} from "./useProducts";

export {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "./useCategories";

export {
  useApproveSubmission,
  useRejectSubmission,
  useSubmissions,
} from "./useSubmissions";

export { useQuote, useQuotes, useUpdateQuoteStatus } from "./useQuotes";

// Services hooks
export {
  useAssignService,
  useDeleteService,
  useService,
  useServiceStats,
  useServices,
  useUpdateServiceStatus,
} from "./useServices";

export {
  useAdminAuction,
  useAdminAuctions,
  useAuctionSnapshot,
  useCreateAuction,
  useFinalizeAuction,
  useUpdateAuction,
} from "./useAuctions";

// Re-export types
export type { Submission } from "./useSubmissions";
