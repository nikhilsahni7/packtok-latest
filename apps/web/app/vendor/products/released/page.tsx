"use client";

import { useVendorProducts } from "@/hooks";
import { useMySubscription } from "@/hooks/useVendorSubscription";
import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
    AlertCircle,
    CheckCircle2,
    Crown,
    ExternalLink,
    Globe,
    Loader2,
    Package,
    Pencil,
    Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function VendorReleasedPage() {
  const { data, isLoading, isError } = useVendorProducts({
    submissionStatus: "APPROVED",
  });
  const { data: subInfo } = useMySubscription();
  const products = data ?? [];
  const canCreate = subInfo?.canCreateProduct ?? true;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Released Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} approved product{products.length !== 1 ? "s" : ""} live on marketplace
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
          Failed to load released products. Please try again.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border">
          <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No released products</h3>
          <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
            Products appear here once they are approved by admin and live on the marketplace
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

      {/* Products grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => {
            const isOutOfStock = product.status === "OUT_OF_STOCK" || product.quantity === 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-gray-100">
                  {product.imagesThumbnail ? (
                    <Image
                      src={product.imagesThumbnail}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                  {/* Status overlay */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge className="bg-green-100 text-green-700 gap-1 text-xs shadow-sm">
                      <CheckCircle2 className="h-3 w-3" /> Live
                    </Badge>
                    {isOutOfStock && (
                      <Badge className="bg-red-100 text-red-700 gap-1 text-xs shadow-sm">
                        <AlertCircle className="h-3 w-3" /> Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                  {product.manufacturer && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {product.manufacturer}
                      {product.model && ` · ${product.model}`}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {product.currency} {Number.parseFloat(product.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Stock: <span className={product.quantity > 0 ? "text-green-600" : "text-red-500"}>{product.quantity}</span>
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <Link
                        href={`/vendor/products/${product.id}`}
                        className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Link>
                      {product.submissionStatus === "APPROVED" && (
                        <a
                          href={`/marketplace/all/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                          title="View on marketplace"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-500" />
                        </a>
                      )}
                      {/* Approved products can only be deleted by admin */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
