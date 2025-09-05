"use client";

import { useVendorApplication } from "@/hooks/useVendorApplication";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function VendorDashboardClient() {
  const { data, isLoading, isError } = useVendorApplication();

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vendor Dashboard
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">
            Unable to load vendor status. Please refresh the page.
          </p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vendor Dashboard
        </h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Welcome to Packtok Vendor Portal
          </h2>
          <p className="text-sm text-blue-700 mb-4">
            You have not applied to become a vendor yet. Start selling your
            products on our platform!
          </p>
          <Link
            href="/auth/vendor/signup"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply to Become a Vendor
          </Link>
        </div>
      </div>
    );

  if (data.status === "PENDING")
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vendor Dashboard
        </h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
            <h2 className="text-lg font-semibold text-amber-900">
              Application Under Review
            </h2>
          </div>
          <p className="text-sm text-amber-700 mb-2">
            Your vendor application is currently pending admin approval.
          </p>
          <p className="text-xs text-amber-600">
            You will receive an email notification once your application has
            been reviewed. In the meantime, feel free to explore our platform.
          </p>
        </div>
      </div>
    );

  if (data.status === "REJECTED")
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vendor Dashboard
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Application Rejected
          </h2>
          <p className="text-sm text-red-700 mb-2">
            Unfortunately, your vendor application was not approved.
          </p>
          {data.notes && (
            <div className="bg-red-100 rounded p-3 mb-4">
              <p className="text-xs font-medium text-red-800 mb-1">Reason:</p>
              <p className="text-sm text-red-700">{data.notes}</p>
            </div>
          )}
          <Link
            href="/auth/vendor/signup"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Re-apply as Vendor
          </Link>
        </div>
      </div>
    );

  // APPROVED - Full Dashboard
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <Link
          href="/vendor/products/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">$12,345</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-sm">↗</span>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-sm">📦</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">+8 new orders today</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-sm">📱</span>
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">3 out of stock</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-sm">👥</span>
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">+5 new this week</p>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Sales Analytics
            </h3>
            <select className="text-sm border rounded-lg px-3 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <span className="text-gray-500">Sales Chart Placeholder</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="text-sm font-medium">Order #{1000 + i}</p>
                  <p className="text-xs text-gray-500">2 items • $129.99</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Popular Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded"
            >
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Product {i}</p>
                <p className="text-xs text-gray-500">
                  {15 - i * 2} sales this week
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
