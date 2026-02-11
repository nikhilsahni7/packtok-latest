"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import {
  Heart,
  Loader2,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

export default function WishlistPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { data, isLoading, refetch } = useBookmarks(currentPage, 20);

  const handleRemoveBookmark = async (
    e: React.MouseEvent,
    productId: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setRemovingId(productId);
    try {
      await api.delete(`/api/v1/user-tracking/bookmarks/${productId}`);
      toast.success("Removed from wishlist");
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

  const getCategorySlug = (categoryName: string) =>
    categoryName.toLowerCase().replaceAll(/\s+/g, "-");

  const getProductUrl = (product: {
    id: string;
    category: { name: string };
  }) => `/marketplace/${getCategorySlug(product.category.name)}/${product.id}`;

  // Filter bookmarks by search
  const filteredBookmarks =
    data?.bookmarks.filter((b) =>
      searchQuery
        ? b.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.product.category.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (b.product.manufacturer || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true
    ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            My Wishlist
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {data?.total || 0} item{data?.total === 1 ? "" : "s"} saved
          </p>
        </div>

        {/* Search */}
        {(data?.total || 0) > 0 && (
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded"
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {(!data || data.total === 0) && (
        <div className="text-center py-16 bg-white border rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Heart className="h-10 w-10 text-red-300" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Browse our marketplace and save products you love by clicking the
            heart icon
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Browse Marketplace
          </Link>
        </div>
      )}

      {/* Filtered empty */}
      {data &&
        data.total > 0 &&
        filteredBookmarks.length === 0 &&
        searchQuery && (
          <div className="text-center py-12 bg-white border rounded-2xl">
            <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No items match &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

      {/* Product Grid */}
      {filteredBookmarks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookmarks.map((bookmark) => {
            const product = bookmark.product;
            const imageSrc =
              product.imagesThumbnail ||
              product.images?.[0] ||
              "/marketplace1.png";
            const isRemoving = removingId === product.id;
            const shouldShowPrice =
              product.displayPrice !== false &&
              (product.productType !== "MACHINERY" || product.cartEnabled);

            return (
              <Link
                key={bookmark.id}
                href={getProductUrl(product)}
                className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Image */}
                <div className="relative bg-gray-50 aspect-[4/3] overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveBookmark(e, product.id)}
                    disabled={isRemoving}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors disabled:opacity-50 z-10"
                    title="Remove from wishlist"
                  >
                    {isRemoving ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </button>

                  {/* Condition Badge */}
                  <span
                    className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full ${
                      product.condition === "NEW"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {product.condition}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    {product.category.name}
                    {product.subCategory && ` / ${product.subCategory}`}
                  </p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-1.5">
                    {product.title}
                  </h3>
                  {product.manufacturer && (
                    <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                      {product.manufacturer}
                      {product.model && ` • ${product.model}`}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    {shouldShowPrice && product.price ? (
                      <span className="text-lg font-bold text-gray-900">
                        {product.currency || "INR"}{" "}
                        {Number.parseFloat(product.price).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 italic">
                        Request Quote
                      </span>
                    )}
                    {product.quantity > 0 ? (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400 mt-2">
                    Added{" "}
                    {new Date(bookmark.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {data.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(data.totalPages, p + 1))
            }
            disabled={currentPage === data.totalPages}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
