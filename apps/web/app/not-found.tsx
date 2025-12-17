import { Home, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8 relative">
          <h1 className="text-[150px] font-bold text-orange-100 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center">
              <Search className="h-12 w-12 text-orange-400" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been
          moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <ShoppingBag className="h-5 w-5" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
