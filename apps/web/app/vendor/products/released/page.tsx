import Link from "next/link";

export default function VendorReleasedPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Released Products</h1>
      <p className="text-sm text-gray-600">
        Approved and live products list here (later).
      </p>
      <Link href="/vendor/products" className="text-blue-600 underline">
        View All
      </Link>
    </div>
  );
}
