"use client";
import Link from "next/link";
import ProductCard from "./product-card";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Cake1 from "@/assets/cake1.png";
import Cake2 from "@/assets/cake2.png";
import Cake3 from "@/assets/cake3.png";
import Cake4 from "@/assets/cake4.png";
import Cake5 from "@/assets/cake5.png";

const newArrivalsData = [
  {
    id: 1,
    name: "Cake Machine",
    price: 199,
    originalPrice: 399,
    rating: 5,
    image: Cake1
  },
  {
    id: 2,
    name: "Cake Machine",
    price: 24.99,
    originalPrice: 120,
    rating: 5,
    image: Cake2
  },
  {
    id: 3,
    name: "Cake Machine",
    price: 24.99,
    originalPrice: 250,
    rating: 5,
    image: Cake3
  },
  {
    id: 4,
    name: "Cake Machine",
    price: 24.99,
    originalPrice: 180,
    rating: 5,
    image: Cake4
  },
  {
    id: 5,
    name: "Cake Machine",
    price: 24.99,
    originalPrice: 75,
    rating: 5,
    image: Cake5
  },
];

export default function NewArrivals() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
      <div className="mx-auto px-4">
        {/* Section Header - Left Aligned */}
        <div className="container mx-auto mb-6 sm:mb-8 md:mb-12 flex md:flex-row flex-col justify-between md:items-center items-left gap-4 md:gap-0 w-[95%] sm:w-[90%] md:w-[85%]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-semibold">
            New Arrivals
          </h2>
          <Link
            href={"/marketplace"}
            className="items-center flex border-b w-fit text-sm sm:text-base md:text-lg gap-1"
          >
            More Products <ArrowRight size={16} className="sm:w-5 sm:h-5" />
          </Link>
        </div>

        {/* Horizontally Scrollable Product List */}
        <div className="relative w-[97.5%] sm:w-[95%] md:w-[94.5%] ml-auto">
          {/* Left Shadow Gradient */}
          {/* <div
            className={`absolute left-0 top-0 bottom-0 w-16 rounded-l-md bg-gradient-to-r from-black/30 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
          /> */}

          {/* Right Shadow Gradient */}
          {/* <div
            className={`absolute right-0 top-0 bottom-0 w-16 rounded-r-md bg-gradient-to-l from-black/30 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
          /> */}

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
            {newArrivalsData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
