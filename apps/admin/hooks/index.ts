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
  useAddSubcategory,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useRemoveSubcategory,
  useUpdateCategory,
  useUpdateSubcategories,
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

export {
  useAdminNotifications,
  useSendAdminNotification,
} from "./useAdminNotifications";
export {
  useAdminArticles,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "./useArticles";
export { useEmailSubscriptions } from "./useEmailSubscriptions";
export { useMessages, useUpdateMessageStatus } from "./useMessages";
export { useAdminUser, useAdminUsers } from "./useUsers";

// Re-export types
export type { Submission } from "./useSubmissions";
