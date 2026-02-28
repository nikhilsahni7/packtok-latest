"use client";

import { useCart } from "@/contexts/cart-context";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { Address } from "@/types/order";
import { ArrowLeft, CreditCard, Loader2, MapPin, Package, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalsByCurrency, itemCount, clearCart, refreshCart } = useCart();
  const user = useAuthStore((s) => s.user);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?redirect=/checkout");
      return;
    }

    // Refresh cart to catch any products deleted by admin
    refreshCart();

    async function fetchAddresses() {
      try {
        const res = await api.get<{ data: Address[] }>("/api/v1/addresses");
        setAddresses(res.data.data || []);
        const defaultAddr = res.data.data?.find((a: Address) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAddresses();
  }, [user, router]);

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay SDK using shared utility
      const { loadRazorpayCheckout } = await import("@/lib/razorpay");
      await loadRazorpayCheckout();

      // Create order
      const { data: orderRes } = await api.post("/api/v1/orders", {
        addressId: selectedAddressId,
      });

      const { order, razorpayOrder, razorpayKey } = orderRes.data;

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Packtok",
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            await api.post("/api/v1/orders/verify-payment", {
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success("Payment successful!");
            await clearCart();
            router.push(`/profile/orders?success=true&order=${order.orderNumber}`);
          } catch (error) {
            toast.error("Payment verification failed");
            router.push(`/profile/orders?failed=true&order=${order.orderNumber}`);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone_number || "",
        },
        theme: {
          color: "#F97316",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast("Payment cancelled", { icon: "ℹ️" });
          },
        },
      };

      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded");
        setIsProcessing(false);
        return;
      }

      const razorpay = new window.Razorpay(options as any);
      razorpay.open();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error?.response?.data?.message || "Failed to initiate checkout");
      // Refresh cart to reflect any removed/unavailable items
      await refreshCart();
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products before checkout</p>
        <Link
          href="/marketplace"
          className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/marketplace"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500">{itemCount} items in your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Shipping Address
              </h2>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No addresses saved</p>
                  <Link
                    href="/account/addresses?redirect=/checkout"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    Add a new address
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedAddressId === addr.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="font-semibold">{addr.fullName}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.addressLine1}
                          {addr.addressLine2 && `, ${addr.addressLine2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">{addr.phoneNumber}</p>
                        {addr.isDefault && (
                          <span className="inline-block mt-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <Link
                    href="/account/addresses?redirect=/checkout"
                    className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    Add a new address
                  </Link>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Order Items
              </h2>
              <div className="divide-y">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.imagesThumbnail ? (
                        <Image
                          src={item.product.imagesThumbnail}
                          alt={item.product.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.product.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {item.product.currency}{" "}
                      {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <div className="text-right space-y-1">
                    {Object.entries(totalsByCurrency).map(([cur, amount]) => (
                      <span key={cur} className="block">{cur} {amount.toLocaleString()}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>Calculated at payment</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <div className="text-right space-y-1">
                      {Object.entries(totalsByCurrency).map(([cur, amount]) => (
                        <span key={cur} className="block">{cur} {amount.toLocaleString()}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || !selectedAddressId}
                className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pay{" "}
                    {Object.entries(totalsByCurrency)
                      .map(([cur, amount]) => `${cur} ${amount.toLocaleString()}`)
                      .join(" + ")}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="h-4 w-4" />
                Secured by Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
