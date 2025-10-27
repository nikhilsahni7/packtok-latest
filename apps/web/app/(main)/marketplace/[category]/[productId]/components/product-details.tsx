"use client";

import { useAuthStore } from "@/store/auth-store";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const { user, accessToken } = useAuthStore();
  const router = useRouter();

  const images = product.images || [];
  const hasPdf = product.pdfUrl;

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
          {/* Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-black text-black" />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-normal">
              11 Reviews
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            {product.title}
          </h1>

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
            {/* Quantity Selector */}
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

          {/* Send Quote Button */}
          <div>
            <button
              onClick={handleQuoteClick}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
            >
              Send Quote
            </button>
          </div>

          {/* SKU and Category */}
          <div className="space-y-3 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm font-normal">
                SKU
              </span>
              <span className="text-xs sm:text-sm font-normal">
                {product.id ? product.id.slice(-8).toUpperCase() : "8832"}
              </span>
            </div>
            <div className="flex justify-between items-start sm:items-center">
              <span className="text-gray-600 text-xs sm:text-sm font-normal">
                CATEGORY
              </span>
              <span className="text-xs sm:text-sm font-normal text-right sm:text-left max-w-[60%] sm:max-w-none">
                {product.category?.name ||
                  "Ice Cream Equipment, Food Processing Machinery"}
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
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Details</h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    {product.additionalInfo ||
                      "This machine automates the full ice cream production process—from pasteurization to freezing—ensuring hygiene, efficiency, and uniformity in every batch. The built-in microprocessor allows for precision control of texture, temperature, and timing. Cleaning is simplified with stainless steel surfaces and automatic rinse features."}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Packaging</h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    Width: 20 &quot; Height: 1 ½ &quot; Length: 21 ¼ &quot;
                    <br />
                    Weight: 7 lb 8 oz
                    <br />
                    Package(s): 1
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12 border-t pt-8">
        <div className="flex border-b">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Questions
          </button>
          <button className="px-4 py-2 border-b-2 border-black text-black font-medium">
            Reviews
          </button>
        </div>
        <div className="py-8">
          <p className="text-gray-600">
            No reviews yet. Be the first to review this product.
          </p>
        </div>
      </div>

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
