import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VendorScheduledPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <Link
        href="/vendor/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-2">Scheduled</h1>
      <p className="text-sm text-gray-600">Coming soon.</p>
    </div>
  );
}
