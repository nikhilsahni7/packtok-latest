"use client";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { useBookmarkToggle } from "@/hooks/useBookmarks";
import { useAuthStore } from "@/store/auth-store";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Heart,
  HelpCircle,
  MessageSquare,
  Minus,
  Plus,
  Share2,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProductCarousel from "./product-carousel";
import QuoteModal from "./quote-modal";

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    imagesThumbnail: string;
    videoUrl?: string;
    videoThumbnail?: string;
    pdfUrl?: string;
    specifications: Record<string, string | number>;
    condition: string;
    manufacturer?: string;
    model?: string;
    year?: number;
    additionalInfo?: string;
    category: {
      name: string;
    };
    subCategory?: string;
    productType: string;
    machineType?: string;
    quantity: number;
    // Cart settings from admin
    cartEnabled?: boolean;
    currency?: string;
    displayPrice?: boolean;
    // FAQs
    faqs?: { question: string; answer: string }[];
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);

  const { user, accessToken } = useAuthStore();
  const router = useRouter();
  const { isBookmarked, isLoading: isBookmarkLoading, toggle: toggleBookmark } = useBookmarkToggle(product.id);

  const images = product.images || [];
  const hasPdf = product.pdfUrl;

  // Cart settings - respect admin toggle
  const isCartEnabled = !!product.cartEnabled;
  const shouldShowPrice = product.displayPrice !== false;
  const currency = product.currency || "INR";

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      if (increment) {
        return Math.min(prev + 1, product.quantity);
      } else {
        return Math.max(prev - 1, 1);
      }
    });
  };

  const handleQuoteClick = () => {
    if (!user || !accessToken) {
      router.push("/auth/signin");
      return;
    }
    setShowQuoteModal(true);
  };

  // Fetch review stats
  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${product.id}/reviews/stats`
        );
        const data = await res.json();
        if (data.statusCode === 200 && data.data && data.data.totalReviews > 0) {
          setReviewStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching review stats:", error);
      }
    };
    fetchReviewStats();
  }, [product.id]);

  const specifications = product.specifications || {};

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
        {/* Product Images */}
        <div className="space-y-4 relative">
          <ProductCarousel
            images={images}
            videoUrl={product.videoUrl}
            videoThumbnail={product.videoThumbnail}
            productTitle={product.title}
            fallbackImage={product.imagesThumbnail}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6 lg:min-h-[600px]">
          {/* Dynamic Rating - Only show if reviews exist */}
          {reviewStats && reviewStats.totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(reviewStats.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-normal">
                {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <button
                  onClick={toggleBookmark}
                  disabled={isBookmarkLoading}
                  className={`p-2.5 rounded-full border transition-all duration-200 ${
                    isBookmarked
                      ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                      : "bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                  }`}
                  title={isBookmarked ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`h-5 w-5 transition-all ${isBookmarked ? "fill-red-500" : ""}`}
                  />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard");
                  }}
                  className="p-2.5 rounded-full border border-gray-200 bg-white text-gray-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200"
                  title="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            {(product.manufacturer || product.model || product.year) && (
              <p className="text-sm text-gray-500 font-medium">
                {[product.manufacturer, product.model, product.year]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            )}
          </div>

          {/* Price Display - show for non-machinery OR if cart is enabled */}
          {shouldShowPrice && (product.productType !== "MACHINERY" || isCartEnabled) && product.price && (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-orange-600">
                {currency} {Number(product.price).toLocaleString()}
              </span>
              {product.quantity > 0 ? (
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-sm text-red-600 font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-100">Out of Stock</span>
              )}
            </div>
          )}

          {/* Product Description */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Specifications */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base sm:text-lg">
              Specifications
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              {product.manufacturer && (
                <div className="flex flex-col sm:flex-row">
                  <span className="font-normal sm:min-w-[120px]">Manufacturer:</span>
                  <span className="sm:ml-2 font-normal">{product.manufacturer}</span>
                </div>
              )}
              {product.model && (
                <div className="flex flex-col sm:flex-row">
                  <span className="font-normal sm:min-w-[120px]">Model:</span>
                  <span className="sm:ml-2 font-normal">{product.model}</span>
                </div>
              )}
              {product.year && (
                <div className="flex flex-col sm:flex-row">
                  <span className="font-normal sm:min-w-[120px]">Year:</span>
                  <span className="sm:ml-2 font-normal">{product.year}</span>
                </div>
              )}
              {product.condition && (
                <div className="flex flex-col sm:flex-row">
                  <span className="font-normal sm:min-w-[120px]">Condition:</span>
                  <span className="sm:ml-2 font-normal">{product.condition}</span>
                </div>
              )}
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row">
                  <span className="font-normal capitalize sm:min-w-[120px]">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <span className="sm:ml-2 font-normal">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector and Download Specification */}
          <div className="space-y-4 sm:space-y-4">
            {/* Quantity Selector - only show for cart-enabled products */}
            {isCartEnabled && (
              <div className="flex items-center justify-start">
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => handleQuantityChange(false)}
                    className={`w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center ${
                      quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(true)}
                    className={`w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center ${
                      quantity >= product.quantity
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={quantity >= product.quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Download Specifications Button */}
            {hasPdf && (
              <a
                href={product.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">
                  Download Specifications
                </span>
                <span className="sm:hidden">Download Specs</span>
              </a>
            )}
          </div>

          {/* Dynamic Button: Add to Cart OR Send Quote */}
          <div>
            {isCartEnabled ? (
              <AddToCartButton
                productId={product.id}
                productTitle={product.title}
                disabled={product.quantity <= 0}
                className="w-full"
              />
            ) : (
              <button
                onClick={handleQuoteClick}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Request Quote
              </button>
            )}
          </div>

          {/* SKU and Category */}
          <div className="space-y-3 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm font-normal">
                SKU
              </span>
              <span className="text-xs sm:text-sm font-normal">
                {product.id.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-start sm:items-center">
              <span className="text-gray-600 text-xs sm:text-sm font-normal">
                CATEGORY
              </span>
              <span className="text-xs sm:text-sm font-normal text-right sm:text-left max-w-[60%] sm:max-w-none">
                {product.category?.name}
              </span>
            </div>
            {product.subCategory && (
              <div className="flex justify-between items-start sm:items-center">
                <span className="text-gray-600 text-xs sm:text-sm font-normal">
                  SUBCATEGORY
                </span>
                <span className="text-xs sm:text-sm font-normal text-right sm:text-left max-w-[60%] sm:max-w-none">
                  {product.subCategory}
                </span>
              </div>
            )}
          </div>
          {/* Additional Info */}
          {product.additionalInfo && (
            <div className="border-t pt-6">
              <button
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-semibold text-lg">Additional Info</span>
                {showAdditionalInfo ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {showAdditionalInfo && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 leading-relaxed font-normal whitespace-pre-wrap">
                    {product.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {product.faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section - Dynamic Reviews */}
      <ReviewsSection
        productId={product.id}
        currentUserId={user?.id || null}
        accessToken={accessToken || null}
      />

      {/* Quote Modal */}
      <QuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        productId={product.id}
        productTitle={product.title}
      />
    </div>
  );
}
