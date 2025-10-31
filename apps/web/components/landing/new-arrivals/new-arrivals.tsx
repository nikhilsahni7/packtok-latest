"use client";
import { useProducts } from "@/hooks/useProducts";
import { Loading } from "@packtok/ui/components/loading";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import ProductCard from "./product-card";

function NewArrivals() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch machinery products from the backend
  const { data: productsData, isLoading } = useProducts({
    productType: "MACHINERY",
    limit: 10,
    page: 1,
  });

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // w-[95%] sm:w-[90%] md:w-[85%]
  return (
    <section className="py-6 sm:py-8 md:py-10">
      <div className="mx-auto ">
        {/* Section Header - Left Aligned */}
        <div className="mx-auto mb-6 sm:mb-8 md:mb-12 flex md:flex-row flex-col justify-between md:items-center items-left gap-4 md:gap-0 w-[95%] sm:w-[90%] md:w-[80%]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-semibold">
            Machinery
          </h2>
          <Link
            href={"/marketplace"}
            className="items-center flex border-b w-fit text-sm sm:text-base md:text-lg gap-1"
          >
            More Products <ArrowRight size={16} className="sm:w-5 sm:h-5" />
          </Link>
        </div>

        {/* Show loading state */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loading variant="jimu" />
          </div>
        )}

        {/* Show products when loaded */}
        {!isLoading && productsData && productsData.items.length > 0 && (
          <div className="relative w-[97.5%] sm:w-[95%] md:w-[91%] ml-auto">
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-6 sm:pb-8 -mx-0 px-4 no-scrollbar"
              onScroll={checkScrollability}
            >
              {productsData.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Show message when no products */}
        {!isLoading && (!productsData || productsData.items.length === 0) && (
          <div className="flex justify-center items-center min-h-[400px] text-gray-500">
            No machinery products available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(NewArrivals);
