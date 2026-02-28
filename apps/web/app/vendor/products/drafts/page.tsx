"use client";

import { useDeleteVendorProduct, useVendorProducts } from "@/hooks";
import { useMySubscription } from "@/hooks/useVendorSubscription";
import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
    AlertCircle,
    AlertTriangle,
    Clock,
    Crown,
    FileEdit,
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

export default function VendorDraftsPage() {
  const { data, isLoading, isError } = useVendorProducts({ status: "DRAFT" });
  const { data: subInfo } = useMySubscription();
  const deleteProduct = useDeleteVendorProduct();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const drafts = data ?? [];
  const canCreate = subInfo?.canCreateProduct ?? true;

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setDeleteTarget(null);
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Draft deleted");
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drafts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {drafts.length} draft{drafts.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canCreate ? (
          <Link href="/vendor/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Product
            </Button>
          </Link>
        ) : (
          <Link href="/vendor/subscription">
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
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
          Failed to load drafts. Please try again.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && drafts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border">
          <FileEdit className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No drafts</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Products you create start as drafts until submitted for review
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

      {/* Drafts list */}
      {!isLoading && drafts.length > 0 && (
        <div className="grid gap-4">
          {drafts.map((product) => {
            const isRejected = product.submissionStatus === "REJECTED";
            const isPending = product.submissionStatus === "PENDING_APPROVAL";

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                    {product.imagesThumbnail ? (
                      <Image
                        src={product.imagesThumbnail}
                        alt={product.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge className="bg-gray-100 text-gray-600 gap-1 text-xs">
                        <Pencil className="h-3 w-3" /> Draft
                      </Badge>
                      {isPending && (
                        <Badge className="bg-amber-100 text-amber-700 gap-1 text-xs">
                          <Clock className="h-3 w-3" /> Pending Review
                        </Badge>
                      )}
                      {isRejected && (
                        <Badge className="bg-red-100 text-red-700 gap-1 text-xs">
                          <XCircle className="h-3 w-3" /> Rejected
                        </Badge>
                      )}
                    </div>
                    {isRejected && product.reviewNotes && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600 bg-red-50 rounded-md p-2">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{product.reviewNotes}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">
                      {product.currency} {Number.parseFloat(product.price).toLocaleString()}
                      {" · "}
                      Created {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                    <Link href={`/vendor/products/${product.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </Link>
                    <button
                      onClick={() => setDeleteTarget({ id: product.id, title: product.title })}
                      disabled={deletingId === product.id}
                      className="p-2 rounded-md border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === product.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
                Delete Draft
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
