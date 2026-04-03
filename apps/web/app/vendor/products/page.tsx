"use client";

import { useDeleteVendorProduct, useVendorProducts } from "@/hooks";
import { useMySubscription } from "@/hooks/useVendorSubscription";
import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Crown,
  ExternalLink,
  Loader2,
  Package,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  AVAILABLE: {
    label: "Available",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    color: "bg-red-100 text-red-700",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  DRAFT: {
    label: "Draft",
    color: "bg-gray-100 text-gray-600",
    icon: <Pencil className="h-3 w-3" />,
  },
  SOLD: {
    label: "Sold",
    color: "bg-blue-100 text-blue-700",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

const submissionConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING_APPROVAL: {
    label: "Pending Review",
    color: "bg-amber-100 text-amber-700",
    icon: <Clock className="h-3 w-3" />,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: <XCircle className="h-3 w-3" />,
  },
};

export default function VendorProductsPage() {
  const { data, isLoading, isError } = useVendorProducts();
  const { data: subInfo } = useMySubscription();
  const deleteProduct = useDeleteVendorProduct();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const products = data ?? [];

  const productCount = subInfo?.productCount ?? 0;
  const productLimit = subInfo?.productLimit ?? 0;
  const canCreate = subInfo?.canCreateProduct ?? true;
  const planName = subInfo?.subscription?.planNameSnapshot ?? "Free";

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setDeleteTarget(null);
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any)?.response?.data?.message || "Failed to delete";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Link
        href="/vendor/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* Subscription Usage */}
      {subInfo && (
        <div className="flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-3 sm:px-4 py-3">
          <Crown className="h-4 w-4 text-blue-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-900">
              <strong>{planName}</strong> &mdash; {productCount} /{" "}
              {productLimit} products
            </p>
          </div>
          <div className="w-24 sm:w-32 bg-blue-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                productCount >= productLimit
                  ? "bg-red-500"
                  : productCount >= productLimit * 0.8
                    ? "bg-amber-500"
                    : "bg-blue-500"
              }`}
              style={{
                width: `${Math.min(100, (productCount / Math.max(productLimit, 1)) * 100)}%`,
              }}
            />
          </div>
          {!canCreate && (
            <Link
              href="/vendor/subscription"
              className="text-xs text-orange-700 font-semibold hover:underline whitespace-nowrap"
            >
              Upgrade Plan
            </Link>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        {canCreate ? (
          <Link href="/vendor/products/new" className="w-full sm:w-auto">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" /> New Product
            </Button>
          </Link>
        ) : (
          <Link href="/vendor/subscription" className="w-full sm:w-auto">
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
              <Crown className="h-4 w-4" /> Upgrade to Add More
            </Button>
          </Link>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          Failed to load products. Please try again.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Create your first product to get started
          </p>
          {canCreate ? (
            <Link href="/vendor/products/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create Product
              </Button>
            </Link>
          ) : (
            <Link href="/vendor/subscription">
              <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                <Crown className="h-4 w-4" /> Upgrade to Add Products
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Products list (mobile) */}
      {!isLoading && products.length > 0 && (
        <div className="md:hidden space-y-3">
          {products.map((product) => {
            const st = statusConfig[product.status] || statusConfig.DRAFT;
            const sub = product.submissionStatus
              ? submissionConfig[product.submissionStatus]
              : null;
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border p-3 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                    {product.imagesThumbnail ? (
                      <Image
                        src={product.imagesThumbnail}
                        alt={product.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.currency}{" "}
                      {Number.parseFloat(product.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Stock: {product.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge className={`${st.color} gap-1 text-xs font-medium`}>
                    {st.icon} {st.label}
                  </Badge>
                  {sub && (
                    <Badge className={`${sub.color} gap-1 text-xs font-medium`}>
                      {sub.icon} {sub.label}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/vendor/products/${product.id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full gap-1.5"
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                  </Link>
                  {product.submissionStatus === "APPROVED" && (
                    <a
                      href={`/marketplace/all/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-md border hover:bg-gray-50 text-gray-500"
                      title="View on marketplace"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {product.submissionStatus !== "APPROVED" && (
                    <button
                      onClick={() =>
                        setDeleteTarget({
                          id: product.id,
                          title: product.title,
                        })
                      }
                      disabled={deletingId === product.id}
                      className="p-2.5 rounded-md border border-red-200 hover:bg-red-50 text-red-500 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products table (desktop) */}
      {!isLoading && products.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">
                    Review
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">Price</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Stock</th>
                  <th className="px-4 py-3 font-medium text-gray-500">
                    Created
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => {
                  const st = statusConfig[product.status] || statusConfig.DRAFT;
                  const sub = product.submissionStatus
                    ? submissionConfig[product.submissionStatus]
                    : null;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Product info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                            {product.imagesThumbnail ? (
                              <Image
                                src={product.imagesThumbnail}
                                alt={product.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">
                              {product.title}
                            </p>
                            {product.manufacturer && (
                              <p className="text-xs text-gray-400 truncate">
                                {product.manufacturer}
                                {product.model && ` • ${product.model}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge
                          className={`${st.color} gap-1 text-xs font-medium`}
                        >
                          {st.icon} {st.label}
                        </Badge>
                      </td>

                      {/* Submission */}
                      <td className="px-4 py-3">
                        {sub ? (
                          <Badge
                            className={`${sub.color} gap-1 text-xs font-medium`}
                          >
                            {sub.icon} {sub.label}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {product.currency}{" "}
                          {Number.parseFloat(product.price).toLocaleString()}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-medium ${product.quantity > 0 ? "text-green-600" : "text-red-500"}`}
                        >
                          {product.quantity}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(product.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/vendor/products/${product.id}`}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          {product.submissionStatus === "APPROVED" && (
                            <a
                              href={`/marketplace/all/${product.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                              title="View on marketplace"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {product.submissionStatus !== "APPROVED" && (
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  id: product.id,
                                  title: product.title,
                                })
                              }
                              disabled={deletingId === product.id}
                              className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === product.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                &ldquo;{deleteTarget.title}&rdquo;
              </p>
              <p className="text-xs text-red-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
