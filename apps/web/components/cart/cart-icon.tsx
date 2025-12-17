"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/cart-context";

export function CartIcon() {
  const { itemCount, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
      aria-label="Open cart"
    >
      <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-orange-600 transition-colors" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
