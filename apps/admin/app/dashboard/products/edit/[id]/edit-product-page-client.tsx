"use client";

import { Button } from "@packtok/ui/components/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetProduct } from "../../../../../hooks";
import EditProductForm from "../../_components/edit-product-form";

interface EditProductPageClientProps {
  productId: string;
}

export default function EditProductPageClient({
  productId,
}: EditProductPageClientProps) {
  const router = useRouter();
  const { data: product, isLoading, error } = useGetProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-36 rounded-md bg-gray-200" />
          <div className="h-8 w-48 rounded bg-gray-200" />
        </div>
        {/* Form skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 w-full rounded-md bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-24 w-full rounded-md bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-10 w-full rounded-md bg-gray-200" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-10 w-full rounded-md bg-gray-200" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-48 w-full rounded-lg bg-gray-200" />
            <div className="h-32 w-full rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Button
            onClick={() => router.push("/dashboard/products")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <EditProductForm product={product} />
    </>
  );
}
