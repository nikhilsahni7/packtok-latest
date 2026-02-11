"use client";

import { useCart } from "@/contexts/cart-context";
import { Button } from "@packtok/ui/components/button";
import {
    ArrowRight,
    ChevronLeft,
    Loader2,
    Minus,
    Plus,
    ShoppingBag,
    Sparkles,
    Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cart,
    itemCount,
    totalAmount,
    currency,
    isLoading,
    updateQuantity,
    removeFromCart
  } = useCart();
  const router = useRouter();

  if (isLoading && !cart) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-12 w-12 text-emerald-500" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="text-gray-500 text-lg">
              Looks like you haven't added anything to your cart yet.
            </p>
          </div>

          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-emerald-200 transition-all duration-300">
            <Link href="/marketplace">
              Explore our Marketplace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center gap-4 mb-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full hover:bg-emerald-50 text-emerald-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-emerald-600 font-medium">{itemCount} items in your bag</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cart?.items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Product Image */}
                <div className="relative w-full sm:w-40 h-40 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                  {item.product.imagesThumbnail ? (
                    <Image
                      src={item.product.imagesThumbnail}
                      alt={item.product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/marketplace/product/${item.product.id}`}
                        className="text-xl font-bold text-gray-900 hover:text-emerald-600 transition-colors"
                      >
                        {item.product.title}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm italic">In Stock: {item.product.quantity}</p>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                    {/* Quantity Controls and Stock Info */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1 gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1 || isLoading}
                          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-white hover:text-emerald-600 disabled:opacity-30 transition-all font-bold"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900 border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.min(item.product.quantity, item.quantity + 1))}
                          disabled={item.quantity >= item.product.quantity || isLoading}
                          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-white hover:text-emerald-600 disabled:opacity-30 transition-all font-bold"
                          title={item.quantity >= item.product.quantity ? "No more stock available" : "Add more"}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Stock Badges */}
                      <div className="flex gap-2">
                        {item.quantity >= item.product.quantity && item.product.quantity > 0 && (
                          <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded border border-orange-100 uppercase tracking-tight">
                            Stock Limit Reached
                          </span>
                        )}
                        {item.product.quantity <= 0 && (
                          <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-100 uppercase tracking-tight">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="text-right">
                      <p className="text-gray-400 text-sm font-medium">Price per item</p>
                      <p className="text-xl font-black text-emerald-600">
                        {currency} {parseFloat(item.product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 sticky top-32">
          <div className="bg-gray-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            {/* Background pattern decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="h-24 w-24 text-white" />
            </div>

            <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Subtotal ({itemCount} items)</span>
                <span>{currency} {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider bg-emerald-400/10 px-2 py-1 rounded">Calculated at checkout</span>
              </div>
              <div className="h-px bg-white/10 my-6" />
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total Amount</p>
                  <p className="text-4xl font-black text-white mt-1">
                    {currency} {totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full h-16 bg-white hover:bg-emerald-50 text-gray-900 rounded-2xl text-lg font-black shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 group"
            >
              <Link href="/checkout" className="flex items-center justify-center gap-3">
                Proceed to Checkout
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <p className="text-center text-gray-500 text-xs mt-6 px-4">
              Secure Checkout • 256-bit SSL Encryption
            </p>
          </div>

          <Link
            href="/marketplace"
            className="flex items-center justify-center gap-2 mt-6 text-gray-500 hover:text-emerald-600 font-bold transition-colors py-4 uppercase text-xs tracking-widest"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
