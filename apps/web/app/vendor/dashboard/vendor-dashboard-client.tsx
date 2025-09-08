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
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Search or type a command
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/vendor/products/new"
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Add product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Sales Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Total Sales Card */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Sales
              </h3>
              <select className="text-sm border rounded-lg px-3 py-1 text-gray-600">
                <option>All time</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">68,192</span>
                <span className="text-lg text-gray-600">Sales</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-600 text-sm">↗ 2.8%</span>
                <span className="text-gray-500 text-sm">vs. Sep 8, 2021</span>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={25 + i * 25}
                    x2="400"
                    y2={25 + i * 25}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}

                {/* Sample data line */}
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  points="20,120 60,100 100,80 140,90 180,70 220,65 260,55 300,60 340,45 380,40"
                />

                {/* Fill area under curve */}
                <polyline
                  fill="url(#salesGradient)"
                  stroke="none"
                  points="20,120 60,100 100,80 140,90 180,70 220,65 260,55 300,60 340,45 380,40 380,150 20,150"
                />

                {/* Data points */}
                {[
                  [20, 120],
                  [60, 100],
                  [100, 80],
                  [140, 90],
                  [180, 70],
                  [220, 65],
                  [260, 55],
                  [300, 60],
                  [340, 45],
                  [380, 40],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#3B82F6" />
                ))}
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>

            {/* Date range */}
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>Jan 1, Oct 31, 2024</span>
              <span>Jan 1, Dec 31, 2025</span>
            </div>
          </div>

          {/* Product Views Chart */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Product views
              </h3>
              <select className="text-sm border rounded-lg px-3 py-1 text-gray-600">
                <option>All time</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>

            {/* Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-4 mb-4">
              {[
                { month: "Jan", lifetime: 85, customer: 60 },
                { month: "Feb", lifetime: 72, customer: 45 },
                { month: "Mar", lifetime: 90, customer: 70 },
                { month: "Apr", lifetime: 45, customer: 35 },
                { month: "May", lifetime: 95, customer: 80 },
                { month: "Jun", lifetime: 25, customer: 20 },
                { month: "Jul", lifetime: 88, customer: 65 },
                { month: "Aug", lifetime: 40, customer: 30 },
                { month: "Sep", lifetime: 75, customer: 55 },
              ].map((data, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div className="flex gap-1 items-end h-40">
                    <div
                      className="bg-blue-500 rounded-t w-4"
                      style={{ height: `${data.lifetime}%` }}
                    ></div>
                    <div
                      className="bg-orange-400 rounded-t w-4"
                      style={{ height: `${data.customer}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Lifetime Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span className="text-sm text-gray-600">Customer Cost</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* New Sale Donut Chart */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              New sale
            </h3>

            <div className="flex items-center justify-center relative mb-6">
              {/* Donut Chart */}
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="20"
                  strokeDasharray="188.4"
                  strokeDashoffset="47.1"
                  strokeLinecap="round"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="20"
                  strokeDasharray="94.2"
                  strokeDashoffset="-94.2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm text-gray-600">New customer</span>
                <span className="text-xl font-bold text-gray-900">20%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">New customer</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Returning customer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular products
            </h3>

            <div className="space-y-4">
              {[
                { name: "Corrugated Machine", price: "$7,750.88", image: "📦" },
                { name: "Corrugated Machine", price: "$3,250.13", image: "📦" },
                { name: "Corrugated Machine", price: "$4,750.17", image: "📦" },
                { name: "Corrugated Machine", price: "$2,000.47", image: "📦" },
              ].map((product, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {product.image}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              All products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
