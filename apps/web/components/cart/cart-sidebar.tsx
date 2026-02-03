"use client";

import { Minus, Package, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../contexts/cart-context";

export function CartSidebar() {
  const {
    cart,
    isOpen,
    closeCart,
    isLoading,
    itemCount,
    totalAmount,
    currency,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              <p className="text-sm text-gray-500">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some products to get started!
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    {item.product.imagesThumbnail ? (
                      <Image
                        src={item.product.imagesThumbnail}
                        alt={item.product.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                      {item.product.title}
                    </h4>
                    <p className="text-orange-600 font-semibold mt-1">
                      {item.product.currency} {parseFloat(item.product.price).toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-white rounded-lg shadow-sm border">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || isLoading}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-4 py-1 text-sm font-medium min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= item.product.quantity || isLoading
                          }
                          className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                          title={item.quantity >= item.product.quantity ? "No more stock available" : "Add more"}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {item.quantity >= item.product.quantity && item.product.quantity > 0 && (
                        <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">
                          STOCK LIMIT REACHED
                        </span>
                      )}

                      {item.product.quantity <= 0 && (
                        <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded">
                          OUT OF STOCK
                        </span>
                      )}

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        disabled={isLoading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {item.product.currency}{" "}
                      {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">
                {currency} {totalAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Shipping & taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
