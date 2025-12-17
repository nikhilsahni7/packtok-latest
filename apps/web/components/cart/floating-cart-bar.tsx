"use client";

import { useCart } from "@/contexts/cart-context";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Pages where the floating cart should not appear
const excludedPaths = ["/checkout", "/cart", "/auth"];

export function FloatingCartBar() {
  const { itemCount, totalAmount, currency, openCart, isOpen } = useCart();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate in when cart has items
  useEffect(() => {
    if (itemCount > 0 && !isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount, isOpen]);

  // Don't show on excluded pages or if cart is empty
  if (!isAnimating && itemCount === 0) return null;
  if (excludedPaths.some((path) => pathname.startsWith(path))) return null;
  if (isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-4 transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Main Cart Bar */}
        <div
          onClick={openCart}
          className="relative overflow-hidden group cursor-pointer"
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/95 via-emerald-500/95 to-teal-500/95 backdrop-blur-xl rounded-2xl" />

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />

          {/* Content */}
          <div className="relative flex items-center justify-between px-5 py-4 rounded-2xl">
            {/* Left side - Cart info */}
            <div className="flex items-center gap-4">
              {/* Animated bag icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                {/* Item count badge with pulse animation */}
                <span className="absolute -top-2 -right-2 bg-white text-emerald-600 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {itemCount}
                </span>
              </div>

              {/* Text content */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-lg tracking-tight">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                </div>
                <p className="text-emerald-100 text-sm font-medium">
                  Total: {currency} {totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Right side - View Cart button */}
            <div className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              <span>View Cart</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Checkout Quick Link - Floating pill below */}
        <Link
          href="/checkout"
          className="mt-3 mx-auto block w-fit text-center bg-white/90 backdrop-blur-md text-gray-800 px-8 py-3 rounded-full shadow-xl font-semibold text-sm hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100"
        >
          <span className="flex items-center gap-2">
            <span>Proceed to Checkout</span>
            <span className="text-emerald-500">→</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
