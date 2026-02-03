"use client";

import { useAuthStore } from "@/store/auth-store";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../../contexts/cart-context";

interface AddToCartButtonProps {
  productId: string;
  productTitle: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  productId,
  productTitle,
  disabled = false,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return;

    // Check if user is logged in
    if (!user || !accessToken) {
      toast("Please sign in to add items to cart", { icon: "🔐" });
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(productId, 1);
      setIsAdded(true);
      toast.success(`${productTitle} added to cart!`, {
        icon: "🛒",
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
        },
      });

      // Reset after animation
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add to cart";

      if (errorMessage.toLowerCase().includes("insufficient stock") || errorMessage.toLowerCase().includes("only")) {
        toast.error(errorMessage, {
          icon: "⚠️",
          duration: 4000
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={`
        relative overflow-hidden group
        px-6 py-3 rounded-xl font-semibold text-white
        transition-all duration-300 ease-out
        ${
          isAdded
            ? "bg-green-500 scale-105"
            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"}
        ${className}
      `}
    >
      {/* Ripple Effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span
          className={`
            absolute inset-0 transform scale-0 rounded-full bg-white/30
            group-active:scale-150 transition-transform duration-500
          `}
        />
      </span>

      {/* Button Content */}
      <span className="relative flex items-center justify-center gap-2">
        {isAdding ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Adding...</span>
          </>
        ) : isAdded ? (
          <>
            <Check className="h-5 w-5 animate-bounce" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 group-hover:animate-bounce" />
            <span>Add to Cart</span>
          </>
        )}
      </span>

      {/* Shine Effect */}
      <span
        className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
          transform -skew-x-12 -translate-x-full group-hover:translate-x-full
          transition-transform duration-700
        `}
      />
    </button>
  );
}
