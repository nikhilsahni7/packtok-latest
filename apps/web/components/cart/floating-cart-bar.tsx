"use client";

import { useCart } from "@/contexts/cart-context";
import { ArrowRight, ShoppingBag, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// Pages where the floating cart should not appear
const excludedPaths = ["/checkout", "/cart", "/auth"];
const PERMANENT_HIDE_KEY = "packtok_hide_cart_bar";

export function FloatingCartBar() {
  const { itemCount, totalsByCurrency, openCart, isOpen } = useCart();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(false);
  const [showPermanentOption, setShowPermanentOption] = useState(false);
  const prevItemCountRef = useRef(itemCount);

  // Load permanent hide preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(PERMANENT_HIDE_KEY);
    if (stored === "true") {
      setIsPermanentlyHidden(true);
      setIsDismissed(true);
    }
  }, []);

  // Re-show bar when cart changes (items added/removed/updated), unless permanently hidden
  useEffect(() => {
    if (isPermanentlyHidden) return;

    const prevCount = prevItemCountRef.current;
    prevItemCountRef.current = itemCount;

    // If item count changed and bar was dismissed, re-show it
    if (itemCount !== prevCount && itemCount > 0 && isDismissed) {
      setIsDismissed(false);
      setShowPermanentOption(false);
    }
  }, [itemCount, isDismissed, isPermanentlyHidden]);

  // Animate in/out
  useEffect(() => {
    const shouldShow = itemCount > 0 && !isOpen && !isDismissed;

    if (shouldShow) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount, isOpen, isDismissed]);

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDismissed(true);
      setShowPermanentOption(false);
    },
    []
  );

  const handleTogglePermanentOption = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowPermanentOption((prev) => !prev);
    },
    []
  );

  const handlePermanentHide = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsPermanentlyHidden(true);
      setIsDismissed(true);
      setShowPermanentOption(false);
      localStorage.setItem(PERMANENT_HIDE_KEY, "true");
    },
    []
  );

  const handleUndoPermanentHide = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsPermanentlyHidden(false);
      setIsDismissed(false);
      setShowPermanentOption(false);
      localStorage.removeItem(PERMANENT_HIDE_KEY);
    },
    []
  );

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
        {/* Permanent hide option tooltip */}
        {showPermanentOption && (
          <div className="mb-2 flex items-center justify-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-gray-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl border border-gray-700/50 flex items-center gap-3 text-sm">
              {isPermanentlyHidden ? (
                <>
                  <span className="text-gray-300">Cart bar is hidden permanently</span>
                  <button
                    onClick={handleUndoPermanentHide}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-lg font-medium transition-colors text-xs"
                  >
                    Show again
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-300">Don&apos;t show this bar?</span>
                  <button
                    onClick={handlePermanentHide}
                    className="bg-red-500/90 hover:bg-red-400 text-white px-3 py-1 rounded-lg font-medium transition-colors text-xs"
                  >
                    Hide permanently
                  </button>
                </>
              )}
            </div>
          </div>
        )}

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
                  Total:{" "}
                  {Object.entries(totalsByCurrency)
                    .map(([cur, amount]) => `${cur} ${amount.toLocaleString()}`)
                    .join(" + ")}
                </p>
              </div>
            </div>

            {/* Right side - View Cart + actions */}
            <div className="flex items-center gap-2">
              {/* View Cart button */}
              <div className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <span>View Cart</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Settings (three-dot) button */}
              <button
                onClick={handleTogglePermanentOption}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Options"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
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
