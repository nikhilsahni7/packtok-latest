"use client";

import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import {
  AlertCircle,
  ArrowLeft,
  Edit,
  FileText,
  Image as ImageIcon,
  Play,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetProduct } from "../../../../../hooks";
import { cxBadge, cxTypeBadge } from "../../../../../utils/badges";
import MediaPreviewModal from "../../_components/media-preview-modal";

interface ViewProductPageClientProps {
  productId: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function ViewProductPageClient({
  productId,
}: ViewProductPageClientProps) {
  const router = useRouter();
  const { data: product, isLoading, error } = useGetProduct(productId);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState<{
    url: string;
    type: "image" | "video";
    name: string;
  } | null>(null);

  const specifications = useMemo(() => {
    if (!product || typeof product.specifications !== "object") return [];
    return Object.entries(product.specifications as Record<string, unknown>);
  }, [product]);

  const faqs = useMemo(() => {
    if (!product) return [];
    if (!Array.isArray(product.faqs)) return [];

    return (product.faqs as FaqItem[]).filter(
      (faq) => faq?.question && faq?.answer,
    );
  }, [product]);

  const openMediaModal = (
    url: string,
    type: "image" | "video",
    name: string,
  ) => {
    setModalMedia({ url, type, name });
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-10 w-36 rounded-md bg-gray-200" />
          <div className="h-8 w-56 rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-xl bg-gray-200" />
          <div className="h-96 rounded-xl bg-gray-200" />
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
            The product you are trying to view does not exist.
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/products")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">View Product</h1>
        </div>

        <Button
          onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={`${cxTypeBadge(product.productType)} text-xs`}>
                {product.productType.replace(/_/g, " ")}
              </Badge>
              <Badge className={`${cxBadge(product.status)} text-xs`}>
                {product.status.replace(/_/g, " ")}
              </Badge>
              {product.submissionStatus ? (
                <Badge variant="outline" className="text-xs">
                  {product.submissionStatus.replace(/_/g, " ")}
                </Badge>
              ) : null}
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              {product.title}
            </h2>
            <p className="text-gray-600 mt-3 whitespace-pre-wrap">
              {product.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-semibold text-gray-900">
                  {product.currency || "INR"}{" "}
                  {Number(product.price).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="font-semibold text-gray-900">
                  {product.quantity} pcs
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Condition</p>
                <p className="font-semibold text-gray-900">
                  {product.condition}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-semibold text-gray-900">
                  {product.category?.name || "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <div>
                <p className="text-xs text-gray-500">Subcategory</p>
                <p className="font-medium text-gray-900">
                  {product.subCategory || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Manufacturer</p>
                <p className="font-medium text-gray-900">
                  {product.manufacturer || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Model</p>
                <p className="font-medium text-gray-900">
                  {product.model || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Year</p>
                <p className="font-medium text-gray-900">
                  {product.year || "-"}
                </p>
              </div>
            </div>

            {product.additionalInfo ? (
              <div className="mt-5 pt-5 border-t">
                <p className="text-xs text-gray-500 mb-1">
                  Additional Information
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {product.additionalInfo}
                </p>
              </div>
            ) : null}
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>

            {product.images?.length ? (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Gallery Images
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        openMediaModal(image, "image", `Image ${index + 1}`)
                      }
                      className="relative aspect-video rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {product.videoUrl ? (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Product Video
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openMediaModal(product.videoUrl!, "video", "Product Video")
                  }
                  className="relative w-full md:w-80 aspect-video rounded-lg overflow-hidden border bg-black/90"
                >
                  {product.videoThumbnail ? (
                    <Image
                      src={product.videoThumbnail}
                      alt="Video thumbnail"
                      fill
                      className="object-cover opacity-70"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play
                        className="h-5 w-5 text-black"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </button>
              </div>
            ) : null}

            {product.pdfUrl ? (
              <div>
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Specification PDF
                </p>
                <a
                  href={product.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4 text-red-600" />
                  Open PDF
                </a>
              </div>
            ) : null}

            {!product.images?.length && !product.videoUrl && !product.pdfUrl ? (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                No media uploaded.
              </div>
            ) : null}
          </div>

          {specifications.length > 0 ? (
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specifications.map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border px-3 py-2 flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-gray-500">{key}</span>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {faqs.length > 0 ? (
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQs</h3>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={`${faq.question}-${index}`}
                    className="rounded-lg border p-4"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {faq.question}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(product.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(product.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Created By</p>
                <p className="font-medium text-gray-900">
                  {product.createdByUser?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Creator Role</p>
                <p className="font-medium text-gray-900">
                  {product.createdByUser?.role || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Display Price</p>
                <p className="font-medium text-gray-900">
                  {product.displayPrice ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Cart Enabled</p>
                <p className="font-medium text-gray-900">
                  {product.cartEnabled ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {product.imagesThumbnail ? (
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thumbnail
              </h3>
              <button
                type="button"
                onClick={() =>
                  openMediaModal(product.imagesThumbnail!, "image", "Thumbnail")
                }
                className="relative w-full aspect-square rounded-lg overflow-hidden border"
              >
                <Image
                  src={product.imagesThumbnail}
                  alt="Product thumbnail"
                  fill
                  className="object-cover"
                />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <MediaPreviewModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalMedia(null);
        }}
        mediaUrl={modalMedia?.url || ""}
        mediaType={modalMedia?.type || "image"}
        mediaName={modalMedia?.name || "Media"}
      />
    </>
  );
}
